import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import { AuthProvider } from "./providers/AuthProvider";
import { ToastProvider } from "./providers/ToastProvider";
import { UserProvider } from "./providers/UserProvider";
import { NotificationProvider } from "./providers/NotificationProvider";
import "./locales/i18n";
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
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
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
