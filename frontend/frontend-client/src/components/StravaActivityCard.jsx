const StravaActivityCard = ({ activity }) => {
    return (
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-gray-100">{activity.name}</h2>
        <p className="text-gray-400 text-sm">{activity.type} • {activity.distance} km</p>
        <p className="text-gray-500 text-xs mt-2">{new Date(activity.start_date).toLocaleString()}</p>
      </div>
    );
  };
  
  export default StravaActivityCard;
  