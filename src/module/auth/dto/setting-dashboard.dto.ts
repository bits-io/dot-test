import { IsOptional } from "class-validator";

export default class SettingDashboardDto {
    @IsOptional()
    dashboardSetting: string;
}