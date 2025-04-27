export declare enum AppointmentType {
    CONSULTATION = "consultation",
    SIGNATURE = "signature",
    DELIVERY = "delivery"
}
export declare class CreateAppointmentDto {
    clientName: string;
    dateTime: string;
    appointmentType: AppointmentType;
}
