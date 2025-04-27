"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentDto = exports.AppointmentType = void 0;
const class_validator_1 = require("class-validator");
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["CONSULTATION"] = "consultation";
    AppointmentType["SIGNATURE"] = "signature";
    AppointmentType["DELIVERY"] = "delivery";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "clientName", void 0);
__decorate([
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "dateTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AppointmentType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "appointmentType", void 0);
//# sourceMappingURL=create-appointment.dto.js.map