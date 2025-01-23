<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">إضافة شركة جديدة</span>
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
            label="البلد"
            :rules="[v => !!v || 'هذا الحقل مطلوب']"
            outlined
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="dialog = false">إغلاق</v-btn>
        <v-btn color="success" @click="createCompany">إضافة شركة</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import apiClient from "../../../service/api";

// Define the types of the fields
const dialog = ref<boolean>(true);

const companyName = ref<string>('');
const companyAddress = ref<string>('');
const country = ref<string>('');
const valid = ref<boolean>(false);

// Define the type of the data to be sent
interface CompanyData {
  companyName: string;
  companyAddress: string;
  country: string;
}

const createCompany = async (): Promise<void> => {
  if (valid.value) {
    const companyData: CompanyData = {
      companyName: companyName.value,
      companyAddress: companyAddress.value,
      country: country.value,
    };

    try {
      const response = await apiClient.post(`/api/companies/99/employees`, companyData);
      console.log('تم إضافة الشركة بنجاح', response.data);
    } catch (error) {
      console.error('حدث خطأ عند إضافة الشركة:', error);
    } finally {
      dialog.value = false;
    }
  }
};
</script>
