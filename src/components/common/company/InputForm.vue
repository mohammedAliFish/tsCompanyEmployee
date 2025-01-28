<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ company?.companyGuid ? "تحديث الشركة" : "إضافة شركة جديدة" }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="companyName"
            label="اسم الشركة"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="companyAddress"
            label="عنوان الشركة"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-text-field>

          <v-text-field
            v-model="country"
            label="الدوله"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="closeForm">إغلاق</v-btn>
        <v-btn color="success" :disabled="!valid" @click="saveCompany">
          {{ company?.companyGuid ? "تحديث" : "إضافة" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import apiClient from "../../../service/api";
import Swal from "sweetalert2";
const emit = defineEmits(["close", "save"]);
const props = defineProps<{ company: { companyGuid?: string; companyName?: string; fullAddress?: string } | null }>();

const dialog = ref<boolean>(true);
const valid = ref<boolean>(false);

const companyName = ref<string>("");
const companyAddress = ref<string>("");
const country = ref<string>("");


watch(
  () => props.company,
  (newCompany) => {
    if (newCompany) {
      companyName.value = newCompany.companyName || "";
      const addressParts = newCompany.fullAddress?.split(" ");
      country.value = addressParts?.pop() || "";
      companyAddress.value = addressParts?.join(" ") || "";
    } else {
      companyName.value = "";
      companyAddress.value = "";
      country.value = "";
    }
  },
  { immediate: true }
);

const closeForm = () => {
  emit("close");
};

const saveCompany = async (): Promise<void> => {
  if (!valid.value) return;

  try {
    const payload = {
      companyName: companyName.value,
      companyAddress: companyAddress.value,
      country: country.value,
    };

    console.log("Sending payload:", payload);

    if (props.company?.companyGuid) {

      await apiClient.put(`/api/companies/${props.company.companyGuid}`, payload);


      Swal.fire({
        title: "تم التحديث!",
        text: "تم تحديث بيانات الشركة بنجاح.",
        icon: "success",
        background: "#121212",
        color: "#ffffff",
        customClass: {
          popup: "popup-dark",
        },
      });
    } else {

      await apiClient.post("/api/companies", payload);


      Swal.fire({
        title: "تم الإضافة!",
        text: "تم إضافة الشركة بنجاح.",
        icon: "success",
        background: "#121212",
        color: "#ffffff",
        customClass: {
          popup: "popup-dark",
        },
      });
    }

    emit("save", { ...payload, companyGuid: props.company?.companyGuid || undefined });
    dialog.value = false;

  } catch (ex) {

    console.error("حدث خطأ أثناء الحفظ:", ex);


    Swal.fire({
      title: "خطأ",
      text: "حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة لاحقاً.",
      icon: "error",
      background: "#121212",
      color: "#ffffff",
      customClass: {
        popup: "popup-dark",
      },
    });
  }
};


</script>
