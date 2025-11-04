import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const districts = [
  "Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", 
  "Visakhapatnam", "Vizianagaram", "West Godavari",
  
  "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", 
  "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke-Kessang", "Papum Pare", 
  "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", 
  
  "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", 
  "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", 
  "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", 
  "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong",
  
  "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", 
  "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", 
  "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", 
  "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran", 
  
  "Chandigarh",
  
  "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", 
  "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", 
  "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja",
  
  "Dadra and Nagar Haveli", "Daman", "Diu",
  
  "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", 
  "South Delhi", "South East Delhi", "South West Delhi", "West Delhi",
  
  "North Goa", "South Goa", 
  
  "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", 
  "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", 
  "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", 
  "Surendranagar", "Tapi", "Vadodara", "Valsad",
  
  "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", 
  "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", 
  "Sonipat", "Yamunanagar", 
  
  "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", 
  "Solan", "Una",
  
  "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", 
  "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur",
  
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", 
  "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", 
  "Seraikela-Kharsawan", "Simdega", "West Singhbhum",
   
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", 
    "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", 
    "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", 
    "Vijayanagara", "Vijayapura", "Yadgir",

    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", 
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",

  
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", 
    "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", 
    "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", 
    "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", 
    "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha",

   
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", 
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", 
    "Solapur", "Thane", "Wardha", "Washim", "Yavatmal",

   
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", 
    "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul",

 
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", 
    "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills",

   
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip",

  
    "Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", 
    "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zünheboto",

   
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", 
    "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", 
    "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh",

    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", 
    "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Muktsar", "Nawanshahr", "Pathankot", "Patiala", 
    "Rupnagar", "Sangrur", "SAS Nagar", "Sri Muktsar Sahib", "Tarn Taran",

  
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", 
    "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", 
    "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", 
    "Tonk", "Udaipur",

 
    "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim",

    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", 
    "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", 
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", 
    "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"]

 



function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    ph: "",
    temperature: "",
    humidity: "",
    rainfall: "",
  });
  const [prediction, setPrediction] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState({
    weather: false,
    sensor: false,
    prediction: false,
  });

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please select your district first!");
      return;
    }

    setError("");
    setWeather(null);
    setIsLoading((prev) => ({ ...prev, weather: true }));

    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/weather?city=${city}`
      );
      setWeather(response.data);
      setFormData((prev) => ({
        ...prev,
        temperature: response.data.temperature,
        humidity: response.data.humidity,
        rainfall: response.data.rainfall,
      }));
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, weather: false }));
    }
  };

  const getSensorData = async () => {
    setError("");
    setIsLoading((prev) => ({ ...prev, sensor: true }));

    try {
      const response = await axios.get("http://localhost:5001/sensor");
      if (response.data.N && response.data.P && response.data.K) {
        setFormData((prev) => ({
          ...prev,
          N: parseFloat(response.data.N).toFixed(2),
          P: parseFloat(response.data.P).toFixed(2),
          K: parseFloat(response.data.K).toFixed(2),
        }));
      } else {
        setError("Invalid sensor data. Please check connection.");
      }
    } catch (error) {
      setError("Failed to fetch sensor data. Please enter manually.");
    } finally {
      setIsLoading((prev) => ({ ...prev, sensor: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction([]);
    setIsLoading((prev) => ({ ...prev, prediction: true }));

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data.high_prob_crops || []);
    } catch (error) {
      setError("Prediction failed. Please check your inputs!");
    } finally {
      setIsLoading((prev) => ({ ...prev, prediction: false }));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <h1>Crop Recomendation</h1>
          </div>
          <p className="tagline">Smart farming System Using Machine Learning</p>
        </div>
      </header>

      <main className="app-content">
        {/* Weather Section */}
<section className="content-section">
  <h2 className="section-title">🌦️ District Weather Information</h2>
  <div className="input-group">
    <label htmlFor="district-input">District Name:</label>
    <input
      list="districts-list"
      id="district-input"
      name="district"
      placeholder="Type or select district"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      className="district-select w-full border p-2 rounded-md"
    />
    <datalist id="districts-list">
      {districts.map((district, index) => (
        <option key={index} value={district}>
          {district}
        </option>
      ))}
    </datalist>
    
    <button
      onClick={getWeather}
      disabled={isLoading.weather || !city}
      className="action-button"
    >
      {isLoading.weather ? (
        <span className="loading-spinner"></span>
      ) : (
        "Get Weather"
      )}
    </button>
  </div>

  {weather && (
    <div className="weather-card">
      <h3>Current Conditions in {weather.city}</h3>
      <div className="weather-stats">
        <div className="weather-stat">
          <span className="stat-icon">🌡️</span>
          <div>
            <p className="stat-value">{weather.temperature}°C</p>
            <p className="stat-label">Temperature</p>
          </div>
        </div>
        <div className="weather-stat">
          <span className="stat-icon">💧</span>
          <div>
            <p className="stat-value">{weather.humidity}%</p>
            <p className="stat-label">Humidity</p>
          </div>
        </div>
        <div className="weather-stat">
          <span className="stat-icon">🌧️</span>
          <div>
            <p className="stat-value">{weather.rainfall} mm</p>
            <p className="stat-label">Rainfall</p>
          </div>
        </div>
      </div>
    </div>
  )}
</section>
        {/* Soil Analysis Section */}
        <section className="content-section">
          <h2 className="section-title">🔬 Soil Nutrient Analysis</h2>
          <div className="sensor-section">
            <button
              onClick={getSensorData}
              disabled={isLoading.sensor}
              className="action-button"
            >
              {isLoading.sensor ? (
                <span className="loading-spinner"></span>
              ) : (
                "Fetch Sensor Data"
              )}
            </button>
            <p className="hint-text">
              Or enter values manually below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="soil-form">
            <div className="form-grid">
              {["N", "P", "K", "ph", "temperature", "humidity", "rainfall"].map(
                (field) => (
                  <div className="form-group" key={field}>
                    <label>
                      {field === "ph" ? "pH" : field.toUpperCase()}
                      {["N", "P", "K"].includes(field) && " (ppm)"}
                      {field === "temperature" && " (°C)"}
                      {field === "humidity" && " (%)"}
                      {field === "rainfall" && " (mm)"}
                    </label>
                    <input
                      type="number"
                      step={field === "ph" ? "0.1" : "1"}
                      name={field}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      required
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                )
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading.prediction}
              className="submit-button"
            >
              {isLoading.prediction ? (
                <span className="loading-spinner"></span>
              ) : (
                "Get Crop Recommendations"
              )}
            </button>
          </form>
        </section>

        {/* Results Section */}
        {prediction.length > 0 && (
          <section className="content-section">
            <h2 className="section-title">🌾 Recommended Crops</h2>
            <p className="results-subtitle">
              Based on your soil and weather conditions
            </p>
            <div className="crop-grid">
              {prediction.map((crop, index) => (
                <div className="crop-card" key={index}>
                  <div className="crop-rank">{index + 1}</div>
                  <h3 className="crop-name">{crop.crop}</h3>
                 
                  <div className="crop-details">
                    <p>Ideal for current conditions</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      
    </div>
  );
}

export default App;
