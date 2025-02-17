
import { createI18n } from 'vue-i18n';

export const messages = {
  en: {
    logout: 'Logout',
    employees: 'Employees',
    companies: 'Companies',
    home: 'Home',
    addCompany: 'Add Company',
    manageCompanies: 'Manage Companies',
    searchCompanies: 'Search Companies',
    deleteCompany: 'Are you sure you want to delete this company?',
    deleteSuccess: 'Company deleted successfully!',
    deleteError: 'Error deleting the company.',
    saveSuccess: 'Data saved successfully!',
    saveError: 'Error saving data.',
  },
  ar: {
    logout: 'تسجيل الخروج',
    employees: 'الموظفين',
    companies: 'الشركات',
    home: 'الصفحة الرئيسية',
    addCompany: 'إضافة شركة',
    manageCompanies: 'إدارة الشركات',
    searchCompanies: 'ابحث عن الشركات',
    deleteCompany: 'هل أنت متأكد أنك تريد حذف هذه الشركة؟',
    deleteSuccess: 'تم حذف الشركة بنجاح!',
    deleteError: 'حدث خطأ أثناء حذف الشركة.',
    saveSuccess: 'تم حفظ البيانات بنجاح!',
    saveError: 'حدث خطأ أثناء حفظ البيانات.',
  },
};

export const i18n = createI18n({
  locale: 'en',
  messages,
});
