<template>
  <Header />
  <div class="innerFrame">
    <div class="d-flex align-center justify-space-between" style="margin-bottom: 100px">
      <div class="text-center">
        <v-btn color="#4f545c" prepend-icon="mdi-plus-circle" @click="openDialog">
          <template #prepend>
            <v-icon color="success" />
          </template>
          اضافة شركه
        </v-btn>
      </div>
      <h2>اداره الشركات</h2>
    </div>

    <v-text-field v-model="searchQuery" label="ابحث عن الشركات" class="mx-4" clearable dir="rtl" style="text-align: right" @input="onSearch"/>

    <v-data-table :items="filteredCompanies" item-value="companyGuid" :loading="loading">
      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <v-btn color="blue" @click="editCompany(item)"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-spacer />
          <v-btn color="red" @click="deleteCompany(item.companyGuid)"><v-icon>mdi-delete</v-icon></v-btn>
        </div>
      </template>

      <thead>
        <tr>
          <th class="text-right">الاجراءات</th>
          <th class="text-right">الدوله</th>
          <th class="text-right">العنوان</th>
          <th class="text-right">اسم الشركه</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in filteredCompanies" :key="company.companyGuid" class="text-right">
          <td>
            <div class="d-flex">
              <v-btn color="blue" @click="editCompany(company)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-spacer />
              <v-btn color="red" @click="deleteCompany(company.companyGuid)"><v-icon>mdi-delete</v-icon></v-btn>
            </div>
          </td>
          <td>{{ company.country }}</td>
          <td>{{ company.companyAddress }}</td>
          <td>{{ company.companyName }}</td>
        </tr>
      </tbody>
    </v-data-table>
  </div>

  <v-dialog v-model="inputForm">
    <InputForm :company="selectedCompany" @close="inputForm = false" @save="handleSave" />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import debounce from "lodash/debounce";
import Header from "../../components/common/Header.vue";
import InputForm from "../../components/common/company/InputForm.vue";
import apiClient from "../../service/api";
import Swal from "sweetalert2";

interface Company {
  companyGuid: string;
  companyName: string;
  companyAddress: string;
  country: string;
}

export default defineComponent({
  name: "CompaniesPage",
  components: { Header, InputForm },

  setup() {
    const searchQuery = ref("");
    const companies = ref<Company[]>([]);
    const loading = ref(false);
    const inputForm = ref(false);
    const selectedCompany = ref<Company | null>(null);

    const fetchCompanies = async () => {
      loading.value = true;
      try {
        const response = await apiClient.get("/api/companies");
        companies.value = response.data;
      } catch (error) {
        Swal.fire({ title: "خطأ", text: "حدث خطأ أثناء جلب البيانات.", icon: "error" });
      } finally {
        loading.value = false;
      }
    };

    const deleteCompany = async (companyId: string) => {
      const confirmDelete = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "هل تريد حذف هذه الشركة؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "نعم, احذفها",
        cancelButtonText: "إلغاء",
      });

      if (confirmDelete.isConfirmed) {
        try {
          await apiClient.delete(`/api/companies/${companyId}`);
          Swal.fire({ title: "تم الحذف!", text: "تم حذف الشركة بنجاح.", icon: "success" });
          fetchCompanies();
        } catch {
          Swal.fire({ title: "خطأ", text: "حدث خطأ أثناء حذف الشركة.", icon: "error" });
        }
      }
    };

    const handleSave = async (companyData: Company) => {
      try {
        const payload = { companyName: companyData.companyName, companyAddress: companyData.companyAddress, country: companyData.country };
        if (companyData.companyGuid) {
          await apiClient.put(`/api/companies/${companyData.companyGuid}`, payload);
        } else {
          await apiClient.post("/api/companies", payload);
        }
        Swal.fire({ title: "نجاح", text: "تم حفظ البيانات بنجاح!", icon: "success", timer: 2000 });
        inputForm.value = false;
        fetchCompanies();
      } catch {
        Swal.fire({ title: "خطأ", text: "حدث خطأ أثناء حفظ البيانات.", icon: "error" });
      }
    };

    const filteredCompanies = computed(() =>
      companies.value.filter(company => company.companyName.includes(searchQuery.value))
    );

    const onSearch = debounce(fetchCompanies, 500);

    onMounted(fetchCompanies);

    return { searchQuery, filteredCompanies, loading, inputForm, selectedCompany, openDialog: () => { selectedCompany.value = null; inputForm.value = true; }, editCompany: (company: Company) => { selectedCompany.value = company; inputForm.value = true; }, deleteCompany, handleSave, onSearch };
  }
});
</script>

<style scoped>

</style>
