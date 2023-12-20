import { Routes, Route } from 'react-router-dom';
import routes from './configRoutes';
import ProtectedRoute from './ProtectedRoute';
const Routers = () => {

  return (
    <Routes>
      {routes.map((route, index) => {
        if (route.protected) {
          return (
            <Route key={index} path={route.path} element={<ProtectedRoute>
              <route.layout>
                <route.component />
              </route.layout>
            </ProtectedRoute>} />
          )
        } else {
          return (
            <Route key={index} path={route.path} element={<route.layout>
              <route.component />
            </route.layout>} />
          )
        }
      })}


    </Routes>
  );
};

export default Routers;
