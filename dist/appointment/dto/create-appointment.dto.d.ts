export declare enum AppointmentType {
    CONSULTATION = "consultation",
    SIGNATURE = "signature",
    DELIVERY = "delivery",
    ADMINISTRATIVE = "administrative",
    URGENT_SIGNATURE = "urgent-signature"
}
export declare class CreateAppointmentDto {
    clientName: string;
    dateTime: string;
    appointmentType: AppointmentType;
}
