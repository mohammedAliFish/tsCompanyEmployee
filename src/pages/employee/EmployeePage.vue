<template>
  <Header />
  <div class="innerFrame">
    <div class="d-flex align-center justify-space-between" style="margin-bottom: 100px;">
      <div class="text-center">
        <v-btn color="#4f545c" prepend-icon="mdi-plus-circle" @click="openDialog">
          <template v-slot:prepend>
            <v-icon color="success"></v-icon>
          </template>
          إضافة موظف
        </v-btn>
      </div>
      <h2>إدارة الموظفين</h2>
    </div>

    <v-data-table :items="employees" item-value="employeeGuid" :loading="loading">
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="blue" @click="editEmployee(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="red" @click="deleteEmployee(item.employeeGuid)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:top>
        <v-text-field
          v-model="searchQuery"
          label="ابحث عن الموظفين"
          class="mx-4"
          clearable
          dir="rtl"
          style="text-align: right"
        ></v-text-field>
      </template>

      <thead>
        <tr>
          <th class="text-right">الإجراءات</th>
          <th class="text-right">الشركه</th>
          <th class="text-right">المنصب</th>
          <th class="text-right">العمر</th>
          <th class="text-right">اسم الموظف</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-right" v-for="employee in employees" :key="employee.employeeGuid">
          <td>
            <div class="d-flex">
              <v-btn color="blue" @click="editEmployee(employee)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" @click="deleteEmployee(employee.employeeGuid)"><v-icon>mdi-delete</v-icon></v-btn>
            </div>
          </td>
          <td>{{ employee.companyName }}</td>
          <td>{{ employee.employeePosition }}</td>
          <td>{{ employee.employeeAge }}</td>
          <td>{{ employee.employeeName }}</td>
        </tr>
      </tbody>
    </v-data-table>
  </div>

  <v-dialog v-model="inputForm">
    <InputForm @close="inputForm = false" @save="fetchEmployees" />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import Header from "../../components/common/Header.vue";
import InputForm from "../../components/common/employee/InputForm.vue";
import apiClient from "@/service/api";
import Swal from "sweetalert2";

interface Employee {
  employeeGuid: string;
  employeeName: string;
  employeeAge: number;
  employeePosition: string;
  companyName: string;
}

export default defineComponent({
  name: "EmployeesPage",
  components: {
    Header,
    InputForm,
  },
  setup() {
    const searchQuery: Ref<string> = ref("");
    const employees: Ref<Employee[]> = ref([]);
    const loading: Ref<boolean> = ref(false);
    const inputForm: Ref<boolean> = ref(false);

    const openDialog = (): void => {
      inputForm.value = true;
    };

    const fetchEmployees = async (): Promise<void> => {
      loading.value = true;
      try {
        const response = await apiClient.get("/api/companies/y/employees/all-employees-with-companies");
        employees.value = response.data;
        console.log(response.data)
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      } finally {
        loading.value = false;
      }
    };

    const deleteEmployee = async (id: string): Promise<void> => {
      try {
        await apiClient.delete(`/api/companies/{companyId}/employees/${id}`);
        Swal.fire("تم الحذف!", "تم حذف الموظف بنجاح.", "success");
        fetchEmployees();
      } catch (error) {
        console.error("فشل في حذف الموظف:", error);
      }
    };

    const editEmployee = (employee: Employee): void => {
      console.log("تحرير الموظف", employee);
      inputForm.value = true;
    };

    onMounted(() => {
      fetchEmployees();
    });

    return {
      searchQuery,
      employees,
      loading,
      inputForm,
      openDialog,
      deleteEmployee,
      editEmployee,
      fetchEmployees,
    };
  },
});
</script>

<style scoped>

</style>
