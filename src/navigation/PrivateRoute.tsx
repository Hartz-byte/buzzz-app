// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// const PrivateRoute: React.FC = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       // Set true if user exists otherwise false
//       setIsAuthenticated(!!user);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   // While Firebase is determining the authentication state, don't render anything.
//   if (isAuthenticated === null) {
//     return null;
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default PrivateRoute;
