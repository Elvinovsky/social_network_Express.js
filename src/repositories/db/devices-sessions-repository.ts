import {
    DeleteResult,
    WithId,
} from "mongodb";
import { SessionDBModel } from "../../models/modelsDevice/device-input";
import {
    devicesSessionsMapping
} from "../../functions/deviceSessionMapping";
import { DeviceView } from "../../models/modelsDevice/device-view";
import { SessionModelClass } from "../../models/mongoose/models";
import mongoose from "mongoose";
import { injectable } from "inversify";

@injectable()
export class DevicesSessionsRepository {

    // Метод для удаления всех сессий (только для тестирования)
    async testingDeleteAllSessions (): Promise<DeleteResult> {
        return await SessionModelClass.deleteMany({});
    }

    // Метод для поиска сессии по времени создания (issuedAt)
    async findDeviceSessionByIAT ( issuedAt: number ): Promise<boolean> {
        const deviceSession =  await SessionModelClass.findOne({ issuedAt: issuedAt });
        return !!deviceSession; // Возвращаем true, если сессия найдена, иначе false.
    }

    // Метод для поиска сессии по идентификатору устройства
    async findDeviceIdAmongSessions ( deviceID: string ): Promise<WithId<SessionDBModel> | null> {
        return  await SessionModelClass.findOne({ deviceId: deviceID });
    }

    // Метод для поиска всех устройств сессии по идентификатору пользователя
    async findDevicesSessionsByUserId ( userId: string ): Promise<DeviceView[] | null> {
        const devicesSessions =  await SessionModelClass.find({ userId: userId });
        if (!devicesSessions) {
            return null; // Возвращаем null, если устройства не найдены.
        }
        return devicesSessionsMapping(devicesSessions); // Применяем функцию маппинга и возвращаем массив устройств.
    }

    // Метод для добавления новой сессии устройства
    async addDeviceSession ( deviceSession: SessionDBModel ):  Promise<mongoose.Document> {
        return await SessionModelClass.create(deviceSession);
    }

    // Метод для обновления сессии устройства
    async updateDeviceSession( newIssuedAt: number, issuedAt: number ):  Promise<boolean> {
        const updateActiveDate = new Date().toISOString();
        const result = await SessionModelClass.updateOne(
            { issuedAt: issuedAt },
            { $set: { issuedAt: newIssuedAt, lastActiveDate: updateActiveDate } }
        );
        return result.matchedCount === 1; // Возвращаем true, если один документ был обновлен, иначе false.
    }

    // Метод для удаления сессии устройства по времени создания (issuedAt)
    async deleteDeviceSessionByIAT (issuedAt: number): Promise<boolean> {
        const result = await SessionModelClass.deleteOne({ issuedAt: issuedAt });
        return result.deletedCount === 1; // Возвращаем true, если один документ был удален, иначе false.
    }

    // Метод для удаления сессии устройства по идентификатору устройства и пользователя
    async deleteDeviceSessionSpecified (deviceId: string, userId: string): Promise<boolean> {
        const result = await SessionModelClass.deleteOne({ userId: userId, deviceId: deviceId });
        return result.deletedCount === 1; // Возвращаем true, если один документ был удален, иначе false.
    }

    // Метод для удаления всех сессий устройств пользователя, кроме определенной по времени создания (issuedAt)
    async deleteDevicesSessionsByUser (issuedAt: number, userId: string): Promise<boolean> {
        const result = await SessionModelClass.deleteMany({
            userId: userId,
            issuedAt: { $ne: issuedAt }, // Исключаем документы с определенным значением issuedAt
            status: { $nin: ['closed', 'expired'] } // Исключаем документы со статусами 'closed' и 'expired'
        });
        return result.deletedCount === 1; // Возвращаем true, если хотя бы один документ был удален, иначе false.
    }
}