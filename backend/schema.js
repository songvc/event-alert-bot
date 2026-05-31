// backend/schema.js
export const typeDefs = `#graphql
  type TechEvent {
    title: String!
    date: String!
    time: String!
    location: String!
    description: String!
    distanceFromSanJose: String!
  }

  type SyncResult {
    success: Boolean!
    message: String!
    eventsSynced: [String]
  }

  type Query {
    getTopTechEvents(radiusMiles: Int!, limit: Int!): [TechEvent]
  }

  type Mutation {
    syncEventsToGoogleCalendar(events: [EventInput!]!): SyncResult!
  }

  input EventInput {
    title: String!
    date: String!
    time: String!
    location: String!
    description: String!
  }
`;
