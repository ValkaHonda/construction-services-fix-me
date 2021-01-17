// src/AppRouter.tsx

import React, { FunctionComponent } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
// import { RecoilRoot } from 'recoil'
import App from './App'
import { Login } from './screens/Login'
import { Profile } from './screens/Profile'
import { Register } from './screens/Register'
import { LoginClient } from './screens/LoginClient'
import { LoginCompany } from './screens/LoginCompanany'
import { RegisterClient } from './screens/RegisterClient'
import { RegisterCompany } from './screens/RegisterCompany'

const AppRouter: FunctionComponent = () => {
  return (
    <Router>
      <Provider store={store}>
        <Switch>
          <Route exact path="/login-client" component={LoginClient} />
          <Route exact path="/login-company" component={LoginCompany} />
          <Route exact path="/register-client" component={RegisterClient} />
          <Route exact path="/register-company" component={RegisterCompany} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/" component={App} />
          <Route exact path="/test-screen" component={() => <div>This is a test screen</div>} />
        </Switch>
      </Provider>
    </Router>
  )
}

// EE: To replace Recoil state management with Redux Toolkit;

//     <Router>
//       <RecoilRoot>
//         <Suspense fallback={<span>Loading...</span>}>
//           <Switch>
//             <Route exact path="/" component={App} />
//           </Switch>
//         </Suspense>
//       </RecoilRoot>
//     </Router>
export default AppRouter
