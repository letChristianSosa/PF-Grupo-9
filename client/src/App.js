import "./Css/app.scss";
import Shoes from "./Components/Shoes";
import {Route, Routes} from "react-router-dom";
import NotFound from "./Components/NotFound";
import NavBar from "./Components/NavBar";
import LandingPage from "./Components/LandingPage";
import Details from "./Components/Details";
import Footer from "./Components/Footer";

import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from "./Components/AdminDashboard";
import AdminPandO from "./Components/AdminPandO";
function App() {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={[<NavBar key={"nav"} />, <LandingPage key={"landing"} />]}
      />
      <Route
        exact
        path="/home"
        element={[
          <NavBar key={"nav"} />,
          <Shoes key={"shoes"} />,
          <Footer key={"footer"} />,
        ]}
      />
      <Route
        exact
        path="home/:id/:model"
        element={[
          <NavBar key={"nav"} />,
          <Details key={"details"} />,
          <Footer key={"footer"} />,
        ]}
      />
      <Route exact  path="home/admin/dashboard"  element={<AdminDashboard/>}/>
      <Route exact  path="home/admin/orders" element={<AdminPandO/>}/>
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  );
}

export default App;
