import './App.css'
function ProfileCard({ name, job, city }) {
return (
    <div className="ProfileCard">
        <h2>Name: {name}</h2>
        <p>Job: {job}</p>
        <p>City: {city}</p>
    </div>
);
}
export default ProfileCard;