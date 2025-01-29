<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ employee?.employeeGuid ? "تحديث الموظف" : "إضافة موظف جديد" }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="employeeName"
            label="اسم الموظف"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="employeeAge"
            label="عمر الموظف"
            type="number"
            :rules="[v => !!v || 'هذا الحقل مطلوب' , v => v > 0 || 'يجب أن يكون رقمًا موجبًا']"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="employeePosition"
            label="المنصب"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-text-field>

          <v-select
            v-model="selectedCompanyId"
            :items="companies"
            item-title="companyName"
            item-value="companyId"
            label="اسم الشركة"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="closeForm">إغلاق</v-btn>
        <v-btn color="success" :disabled="!valid" @click="saveEmployee">
          {{ employee?.employeeGuid ? "تحديث" : "إضافة" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import apiClient from "../../../service/api";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "save"]);
const props = defineProps<{
  employee: {
    employeeGuid?: string;
    employeeName?: string;
    employeeAge?: number;
    employeePosition?: string;
    companyId?: string;
  } | null
}>();

const dialog = ref<boolean>(true);
const valid = ref<boolean>(false);

const employeeName = ref<string>("");
const employeeAge = ref<number | null>(null);
const employeePosition = ref<string>("");
const selectedCompanyId = ref<string>("");
const isSaving = ref<boolean>(false);
const companies = ref<{ companyId: string; companyName: string }[]>([]);

watch(
  () => props.employee,
  (newEmployee) => {
    if (newEmployee) {
      employeeName.value = newEmployee.employeeName || "";
      employeeAge.value = newEmployee.employeeAge || null;
      employeePosition.value = newEmployee.employeePosition || "";
      selectedCompanyId.value = newEmployee.companyId || "";
    } else {
      employeeName.value = "";
      employeeAge.value = null;
      employeePosition.value = "";
      selectedCompanyId.value = "";
    }
  },
  { immediate: true }
);

const fetchCompanies = async () => {
  try {
    const response = await apiClient.get("/api/companies");
    companies.value = response.data;
  } catch (error) {
    console.error("فشل في جلب قائمة الشركات:", error);
  }
};

onMounted(fetchCompanies);

const closeForm = () => {
  emit("close");
};

const saveEmployee = async (): Promise<void> => {
  if (isSaving.value) return;
  isSaving.value = true;

  try {
    const payload = {
      employeeName: employeeName.value,
      employeeAge: employeeAge.value,
      employeePosition: employeePosition.value,
    };

    if (props.employee?.employeeGuid) {
      await apiClient.put(`/api/companies/${selectedCompanyId.value}/employees/${props.employee.employeeGuid}`, payload);
      Swal.fire("تم التحديث!", "تم تحديث بيانات الموظف بنجاح.", "success");
    } else {
      await apiClient.post(`/api/companies/${selectedCompanyId.value}/employees`, payload);
      Swal.fire("تمت الإضافة!", "تمت إضافة الموظف بنجاح.", "success");
    }

    emit("save", { ...payload, employeeGuid: props.employee?.employeeGuid || undefined, companyId: selectedCompanyId.value });
    dialog.value = false;
  } catch (ex) {
    console.error("حدث خطأ أثناء الحفظ:", ex);
    Swal.fire("خطأ", "حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة لاحقاً.", "error");
  } finally {
    isSaving.value = false;
  }
};
</script>
