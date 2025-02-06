import "../Style/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../component/NavBar";
import profile from "../assets/profile.jpg";
import profileg from "../assets/profileGirl.jpg";
import { useState, useEffect, Fragment } from "react";

// ✅ Define User Type
interface User {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
}

function Profile() {
  // ✅ Updated useState Hook with Type
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            window.location.href = "/login";
          }
        })
        .then((data: User) => {
          setUser(data);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else {
      window.location.href = "/login";
    }
  }, []);

  // ✅ Prevent rendering before user data is loaded
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <NavBar />
      <div className="widt">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="main-profile">
                    <div className="row">
                      <div className="col-lg-4">
                        {/* ✅ Render user profile image based on gender */}
                        <img src={user.gender === "female" ? profileg : profile} alt="Profile" />
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <div className="main-info header-text">
                          <h1 id="firstname">{user.firstName}</h1>
                          <h5 id="lastname">{user.lastName}</h5>
                          <p>
                            "I'm {user.firstName}, a passionate gamer who loves exploring new worlds
                            and conquering challenges. Let's conquer the gaming world together!"
                          </p>
                          <div className="main-border-button">
                            <a href="#">Update</a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <ul>
                          <li>
                            Email <span>{user.email}</span>
                          </li>
                          <li>
                            Age <span>{user.age}</span>
                          </li>
                          <li>
                            Phone Number <span>{user.phone}</span>
                          </li>
                          <li>
                            Clips <span>29</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Rest of the JSX code */}
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Profile;
