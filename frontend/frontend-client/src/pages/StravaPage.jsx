import { useEffect, useState } from "react";

const StravaPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
//CHANGE API GATEWAY LINK TO STRAVA API
        const response = await fetch("https://api.andknapp.com/strava");
        if (!response.ok) throw new Error("Failed to fetch activities");

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="text-gray-400 text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">Strava Activities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <StravaActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default StravaPage;
