export const reportFileName = (datetime: string): string => `report_${datetime}.md`;
export const reportTitle = (datetime: string): string => `Execution Report - Date: ${datetime}`;
export const reportAction = (action: string): string => `Action: ${action}`;
export const reportStatus = (status: string): string => `Status: ${status}`;
export const reportErrorMessage = (message: string): string => `Error Message: ${message}`;
export const reportData = (): string => 'Data:';
export const reportFolderName = (): string => 'reports';

export const getUserLogStart = (): string => 'Retrieving new user information';
export const getUserLogSuccess = (): string => 'User information was successfully retrieved';
export const getUserLogError = (): string => 'An error occurred during user information retrieval';

export const addClientLogStart = (): string => 'Creating new client';
export const addClientLogSuccess = (): string => 'Client was successfully created';
export const addClientLogError = (): string => 'An error occurred during client creation';

export const addNewClientPropertyLogStart = (): string => 'Creating new property for new client';
export const addPreviousClientPropertyLogStart = (): string => 'Creating new property for previous client';
export const addPropertyLogSuccess = (): string => 'Property was successfully created';
export const addPropertyLogError = (): string => 'An error occurred during property creation';
