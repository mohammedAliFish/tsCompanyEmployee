<template>
  <Header />
  <div class="innerFrame">
    <div
      class="d-flex align-center justify-space-between"
      style="margin-bottom: 100px"
    >
      <div class="text-center">
        <v-btn
          color="#4f545c"
          prepend-icon="mdi-plus-circle"
          @click="openDialog"
        >
          <template #prepend>
            <v-icon color="success" />
          </template>
          اضافة
        </v-btn>
      </div>
      <h2>اداره الشركات</h2>
    </div>

    <v-data-table
      :items="companies"
      item-value="companyGuid"
      :loading="loading"
    >
      <template #[`item.actions`]="{ item }">
        <v-btn
          color="blue"
          @click="editCompany(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          color="red"
          @click="deleteCompany(item.companyGuid)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #top>
        <v-text-field
          v-model="searchQuery"
          label="ابحث عن الشركات"
          class="mx-4"
          clearable
          dir="rtl"
          style="text-align: right"
        />
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
        <tr
          v-for="company in companies"
          :key="company.companyGuid"
          class="text-right"
        >
          <td>
            <div class="d-flex">
              <v-btn
                color="blue"
                @click="editCompany(company)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-spacer />
              <v-btn
                color="red"
                @click="deleteCompany(company.companyGuid)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
    <InputForm
      :company="selectedCompany"
      @close="inputForm = false"
      @save="handleSave"
    />
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
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

  components: {
    Header,
    InputForm,
  },

  setup() {
    const searchQuery = ref("");
    const companies = ref<Company[]>([]);
    const loading = ref(false);
    const inputForm = ref(false);
    const selectedCompany = ref<Company | null>(null);

    const openDialog = (): void => {
      selectedCompany.value = null;
      inputForm.value = true;
    };

    const editCompany = (company: Company): void => {
      selectedCompany.value = company;
      inputForm.value = true;
    };

    const fetchCompanies = async (): Promise<void> => {
      loading.value = true;
      try {
        const response = await apiClient.get("/api/companies", {
          params: {
            search: searchQuery.value,
          },
        });
        companies.value = response.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Swal.fire({
          title: "خطأ",
          text: "حدث خطأ أثناء جلب البيانات.",
          icon: "error",
        });
      } finally {
        loading.value = false;
      }
    };

    const deleteCompany = async (companyId: string): Promise<void> => {
      const confirmDelete = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "هل أنت متأكد أنك تريد حذف هذه الشركة؟",
        icon: "warning",
        background: "#121212",
        color: "#ffffff",
        showCancelButton: true,
        confirmButtonText: "نعم, احذفها",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        customClass: {
          popup: "popup-dark",
        },
      });

      if (confirmDelete.isConfirmed) {
        try {
          await apiClient.delete(`/api/companies/${companyId}`);
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف الشركة بنجاح.",
            icon: "success",
            background: "#121212",
            color: "#ffffff",
            timer: 2000,
            customClass: {
              popup: "popup-dark",
            },
          });
          companies.value = companies.value.filter(
            (company) => company.companyGuid !== companyId
          );
        } catch (error) {
          Swal.fire({
            title: "خطأ",
            text: "حدث خطأ أثناء حذف الشركة.",
            icon: "error",
            background: "#121212",
            color: "#ffffff",
            customClass: {
              popup: "popup-dark",
            },
          });
        }
      }
    };

    const handleSave = async (companyData: Company): Promise<void> => {
      try {
        const payload = {
          companyName: companyData.companyName,
          companyAddress: companyData.companyAddress,
          country: companyData.country,
        };

        if (companyData.companyGuid) {
          await apiClient.put(`/api/companies/${companyData.companyGuid}`, payload);
          companies.value = companies.value.map((company) =>
            company.companyGuid === companyData.companyGuid
              ? { ...company, ...payload }
              : company
          );
        } else {
          const response = await apiClient.post("/api/companies", payload);
          companies.value.push(response.data);
        }

        Swal.fire({
          title: "نجاح",
          text: "تم حفظ البيانات بنجاح!",
          icon: "success",
          timer: 2000,
        });

        inputForm.value = false;
      } catch (error: unknown) {
        const errorMessage =
          error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات.";
        Swal.fire({
          title: "خطأ",
          text: errorMessage,
          icon: "error",
        });
      }
    };

    onMounted(() => {
      fetchCompanies();
    });

    watch(searchQuery, () => {
      fetchCompanies();
    });

    return {
      searchQuery,
      companies,
      loading,
      inputForm,
      selectedCompany,
      openDialog,
      editCompany,
      deleteCompany,
      handleSave,
    };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
