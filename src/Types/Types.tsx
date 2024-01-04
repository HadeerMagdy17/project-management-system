export interface FormValues {
    title: string;
    description: string;
    employeeId?: number;
    projectId?: number;
  }

  export interface projectType {
    id: number;
    title: string;
    description: string;
  }

  export interface IAuth {
    userData: string;
    saveUserData: () => void;
    requestHeaders: string;
    baseUrl: string;
    userRole: string;
  }