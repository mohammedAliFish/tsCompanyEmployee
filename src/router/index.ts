

import {createRouter, createWebHistory} from "vue-router";
import Home from '../pages/home/Home.vue';
import EmployeePage from "../pages/employee/EmployeePage.vue";
import CompanyPage from  "../pages/company/CompanyPage.vue"
import Login from "../pages/Login.vue"



const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/employees", name: "Employees", component: EmployeePage },
  { path: "/companies", name: "Companies", component: CompanyPage },
  { path: "/login"    , name: "Login"    , component: Login}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
