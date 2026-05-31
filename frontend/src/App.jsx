// frontend/src/App.jsx
import React, { useState } from 'react';
import { useQuery,useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Calendar, MapPin, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';

const FETCH_TECH_EVENTS = gql`
  query GetTopTechEvents($radiusMiles: Int!, $limit: Int!) {
    getTopTechEvents(radiusMiles: $radiusMiles, limit: $limit) {
      title
      date
      time
      location
      description
      distanceFromSanJose
    }
  }
`;

const SYNC_CALENDAR = gql`
  mutation SyncEventsToGoogleCalendar($events: [EventInput!]!) {
    syncEventsToGoogleCalendar(events: $events) {
      success
      message
      eventsSynced
    }
  }
`;

export default function App() {
  const { loading, error, data, refetch } = useQuery(FETCH_TECH_EVENTS, {
    variables: { radiusMiles: 25, limit: 10 }
  });

  const [syncEvents, { loading: syncing, data: syncData }] = useMutation(SYNC_CALENDAR);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleAutomatedCalendarGeneration = async () => {
    if (!data || !data.getTopTechEvents) return;
    
    // Format payload for mutation matching schema expectations
    const eventPayload = data.getTopTechEvents.map(({ title, date, time, location, description }) => ({
      title, date, time, location, description
    }));

    try {
      const res = await syncEvents({ variables: { events: eventPayload } });
      if (res.data.syncEventsToGoogleCalendar.success) {
        setSuccessBanner(true);
      }
    } catch (err) {
      console.error("Transaction deployment execution error:", err);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', color: '#0f172a', margin: 0 }}>Autonomous Silicon Valley AI Agent</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Top 10 High-Priority Tech Events within 25 Miles of San Jose</p>
        </div>
        <button 
          onClick={() => refetch()} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> Rescan
        </button>
      </header>

      {successBanner && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} />
          <span><strong>Success!</strong> Created Google Calendar instances matching {syncData?.syncEventsToGoogleCalendar?.eventsSynced?.length} parsed records automatically.</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#64748b' }}>Querying LLM and filtering hyper-local event infrastructure data...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>Error contacting GraphQL Agent: {error.message}</p>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              onClick={handleAutomatedCalendarGeneration}
              disabled={syncing}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            >
              <Sparkles size={18} /> {syncing ? "Generating Invites..." : "Auto-Generate Google Calendar"}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {data?.getTopTechEvents?.map((evt, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', background: '#dbeafe', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontWeight: 'bold' }}>{evt.distanceFromSanJose} away</span>
                <h3 style={{ fontSize: '1.25rem', color: '#1e293b', margin: '0.75rem 0 0.5rem 0' }}>{evt.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.4', marginBottom: '1rem' }}>{evt.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> <span>{evt.date} @ {evt.time}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> <span>{evt.location}</span></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
