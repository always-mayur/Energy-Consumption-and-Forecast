# 🔋 Home Power Consumption & Forecasting  

A smart home energy monitoring web application that tracks power usage, provides alerts, and predicts future energy consumption trends. Built using **React.js, Bootstrap, Material-UI, Express.js, Node.js, MongoDB, and Docker**.  

## 🚀 Features  

- **Dashboard Visualization:** Displays real-time power consumption with interactive charts.  
- **Room & Appliance Management:** Allows users to log appliances per room to track energy usage.  
- **Threshold Alerts:** Notifies users when power consumption exceeds the defined limit.  
- **Energy Forecasting:** Implements machine learning models to predict future energy consumption based on historical data.  
- **User Authentication:** Secure login and registration using **Passport.js**.  
- **RESTful APIs:** Efficient routing and communication between frontend and backend.  
- **Error Handling Middleware:** Ensures smooth API interactions and debugging.  
- **Cloud Storage:** Stores energy data securely using **MongoDB Atlas**.  
- **Docker Containerization:** The project is containerized for seamless deployment and scalability.  

## 🧠 ML Algorithms Used  

The ML modules implement several algorithms:  

- **Moving Average Models:** For short-term forecasting  
- **Seasonal Adjustment:** For accounting for time-of-year effects  
- **Classification Models:** For categorizing appliance types and usage patterns  
- **Rule-Based Systems:** For generating optimization recommendations  

## 🛠️ Tech Stack  

### 🔹 Frontend  
- React.js  
- Bootstrap (Responsive Design)  
- Material-UI (Icons & UI Enhancements)  

### 🔹 Backend  
- Node.js & Express.js (Server & API Development)  
- Passport.js (User Authentication)  
- MongoDB Atlas (Cloud Database)  

### 🔹 DevOps & Deployment  
- Docker (Containerization)  
- RESTful APIs (Backend Communication)  

## 📂 Installation & Setup  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/always-mayur/Energy-Consumption-and-Forecast.git
   cd Energy-Consumption-and-Forecast
   ```  
   
2. **Install dependencies**  
   ```bash
   npm install
   cd client
   npm install
   ```  

3. **Set up environment variables**  
   - Configure MongoDB Atlas connection in `.env`.  

4. **Run the application**  
   ```bash
   npm run dev
   ```  

5. **Run in Docker**  
   ```bash
   docker build -t mayur755/energyc:v1 .
   docker run -p 3000:3000 -p 5000:5000 mayur755/energyc:v1
   ```  

## 🔮 Future Enhancements  

- **AI-Powered Optimization:** Implementing advanced ML models for smarter energy recommendations.  
- **Integration with IoT:** Direct data fetching from smart home devices.  
- **Enhanced User Profiles:** Personalized energy insights and tips.  

## Web-Page Snapshots

### Dashboard View  
![Home](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(123).png?raw=true)
![Home](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(124).png?raw=true)

### Dashboard View 
![Dashboard](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(127).png?raw=true)

### Appliance List  
![Appliance List](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(128).png?raw=true)


### Rooms List  
![Rooms List](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(129).png?raw=true)

### Emergy Consumption Forecast  
![Forecast](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(131).png?raw=true)

### Energy Optimization 
![Optimization](https://github.com/always-mayur/Energy-Consumption-and-Forecast/blob/main/client/public/Screenshot%20(132).png?raw=true)


  
