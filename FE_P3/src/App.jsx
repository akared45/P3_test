import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import routes from "./routes/routes";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { UserProvider } from "./providers/UserProvider";
import { connectSocket, disconnectSocket } from "./services/socket";
function App() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("🟢 App Init: Connecting socket...");
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, []); 
  return (
    <ToastProvider>
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element}>
                  {route.children?.map((child, idx) => (
                    <Route
                      key={idx}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
                </Route>
              ))}
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
