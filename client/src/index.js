import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignIn from './components/User/SignIn';
import SignUp from './components/User/SignUp';
import { UserProvider } from './components/User/UserProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/Common/PageNotFound';
import { Home } from './components/Common/Home';
import { News } from './components/Common/News';
import { About } from './components/Common/About'
import { DetailAccount } from './components/User/DetailAccount';
import { StudentProfile } from './components/Student/StudentProfile';
import { CompanyProfile } from './components/Company/CompanyProfile';
import { AccountManager } from './components/Admin/AccountManager';
import { StudentManager } from './components/Admin/StudentManager';
import { StudentDetailAdmin } from './components/Admin/StudentDetail';
import { StudentDetailCompany } from './components/Company/StudentDetailCompany';
import { CompanyManager } from './components/Admin/CompanyManager';
import { CompanyList } from './components/Student/CompanyList';
import { DetailAccountAdmin } from './components/Admin/AccountDetail';
import { CompanyDetailAdmin } from './components/Admin/ComanyDetail';
import { AddRecruit } from './components/Company/AddRecruit';
import { RecruitManager } from './components/Company/RecruitManager';
import { RecruitProfile } from './components/Company/RecruitProfile';
import { CompanyDetailStudent } from './components/Student/CompanyDetailStudent';
import { RecruitManagerAdmin } from './components/Admin/RecruitManager';
import { RecruitDetailAdmin } from './components/Admin/RecruitDetail';
import { StudentList } from './components/Company/StudentList';
import { RecruitListStudent } from './components/Student/RecruitList';
import { RecruitCompanyListStudent } from './components/Student/RecruitCompanyList';
import { RecruitDetailStudent } from './components/Student/RecruitDetail';
import { MyCV } from './components/Student/MyCV';
import { CVManagerAdmin } from './components/Admin/CVManager';
import { CVList } from './components/Company/CVList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path="/" element={<App />} >
          <Route path="home" element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="about" element={<About />} />
          <Route path="myaccount" element={<DetailAccount />} />
          <Route path='student-profile' element={<StudentProfile />} />
          <Route path='company-profile' element={<CompanyProfile />} />
          <Route path='account-management' element={<AccountManager />} />
          <Route path='account/:id'  element={<DetailAccountAdmin />} />
          <Route path='student-management' element={<StudentManager />} />
          <Route path='company-management' element={<CompanyManager />} />
          <Route path='cv-management' element={<CVManagerAdmin />} />
          <Route path='my-cv' element={<MyCV />} />
          <Route path='admin'>
            <Route path='student/:id' element={<StudentDetailAdmin/>}/>
            <Route path='company/:id' element={<CompanyDetailAdmin/>}/>
            <Route path='recruit/:id' element={<RecruitDetailAdmin/>}/>
            <Route path='recruit-list' element={<RecruitManagerAdmin/>}/>
          </Route>
          <Route path='company'>
            <Route path='student/:id' element={<StudentDetailCompany/>}/>
            <Route path='recruit/:id' element={<RecruitProfile/>}/>
            <Route path='recruit-list' element={<RecruitManager/>}/>
            <Route path='student-list' element={<StudentList/>}/>
            <Route path='cv-list' element={<CVList/>}/>
          </Route>
          <Route path='student'>
            <Route path='company/:id' element={<CompanyDetailStudent/>}/>
            <Route path='company-list' element={<CompanyList />} />
            <Route path='recruit-list/company/:id' element={<RecruitCompanyListStudent />} />
            <Route path='recruit-list' element={<RecruitListStudent />} />
            <Route path='recruit/:id' element={<RecruitDetailStudent />} />
          </Route>
          <Route path='recruit'>
            <Route path='add' element={<AddRecruit/>}/>
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
