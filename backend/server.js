// backend/server.js
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { google } from 'googleapis';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Mock Event aggregator database (simulating scraped/raw local tech event data matching 2026 timelines)
const rawScrapedEvents = [
  { title: "TechEx North America 2026", date: "2026-05-18", time: "09:15", location: "San Jose McEnery Convention Center, CA", description: "High-level briefing across AI, Cyber Security, IoT, and Digital Transformation.", coordinates: { lat: 37.3292, lng: -121.8890 } },
  { title: "Plug and Play Silicon Valley May Summit 2026", date: "2026-05-19", time: "08:00", location: "Sunnyvale, CA", description: "3 Full Days of Innovation, 200+ Groundbreaking AI Startups pitching.", coordinates: { lat: 37.3688, lng: -122.0363 } },
  { title: "Cyber Security Congress North America", date: "2026-06-01", time: "10:00", location: "San Jose McEnery Convention Center, CA", description: "Enterprise security strategies and zero-trust framework reviews.", coordinates: { lat: 37.3292, lng: -121.8890 } },
  { title: "Silicon Valley Cybersecurity Conference", date: "2026-06-09", time: "09:00", location: "San Jose State University", description: "Academic and industrial collaborations on cryptographic network primitives.", coordinates: { lat: 37.3352, lng: -121.8811 } },
  { title: "NXP Tech Days Silicon Valley", date: "2026-08-18", time: "09:00", location: "Santa Clara Marriott, CA", description: "Hands-on developer training for automotive microcontrollers and physical edge AI infrastructure.", coordinates: { lat: 37.3856, lng: -121.9831 } }
];

// Setup Google Calendar OAuth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// NOTE: In production, store your persistent client credentials/refresh tokens securely.
// For this standalone setup, we configure an access token manually or inject via OAuth flow.
oauth2Client.setCredentials({ refresh_token: "YOUR_STORED_REFRESH_TOKEN" });
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const resolvers = {
  Query: {
    getTopTechEvents: async (_, { radiusMiles, limit }) => {
      // AI Agent Logic: Filter, reason, and ranks data elements using Structured Outputs
      const prompt = `
        You are an advanced AI Event curation Agent. Given the following raw list of events in Silicon Valley for 2026, parse, filter, and extract only the top ${limit} most important technical events that are strictly within a ${radiusMiles} mile radius of San Jose (Lat: 37.3382, Lng: -121.8863). 
        
        Raw Data: ${JSON.stringify(rawScrapedEvents)}
        
        Return a strict JSON array containing elements with these exact keys: title, date, time, location, description, and distanceFromSanJose. Do not include markdown code wrappers outside the array string.
      `;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        const rawResult = JSON.parse(response.choices[0].message.content);
        // Find or check object array structure inside response wrapper
        return Array.isArray(rawResult) ? rawResult : rawResult.events || Object.values(rawResult)[0];
      } catch (error) {
        console.error("AI Agent validation or processing fault:", error);
        throw new Error("Failed to leverage internal LLM reasoning layer over raw data feeds.");
      }
    }
  },
  Mutation: {
    syncEventsToGoogleCalendar: async (_, { events }) => {
      const syncedTitles = [];
      try {
        for (const event of events) {
          const startDateTime = new Date(`${event.date}T${event.time}:00`);
          const endDateTime = new Date(startDateTime.getTime() + (2 * 60 * 60 * 1000)); // default 2 hours long

          await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
              summary: event.title,
              location: event.location,
              description: event.description,
              start: { dateTime: startDateTime.toISOString(), timeZone: 'America/Los_Angeles' },
              end: { dateTime: endDateTime.toISOString(), timeZone: 'America/Los_Angeles' },
            },
          });
          syncedTitles.push(event.title);
        }
        return { success: true, message: "Successfully populated Google Calendar.", eventsSynced: syncedTitles };
      } catch (err) {
        console.error("Google Calendar Synchronization crash:", err);
        return { success: false, message: `Calendar API Fault: ${err.message}`, eventsSynced: syncedTitles };
      }
    }
  }
};

// Fire up Apollo server 
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: process.env.PORT || 4000 } });
console.log(`🚀 GraphQL Backend & AI Agent layer ready at: ${url}`);
