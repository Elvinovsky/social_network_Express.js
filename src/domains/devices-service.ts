import { ObjectId } from "mongodb";
import { SessionDBModel } from "../models/modelsDevice/device-input";
import add from "date-fns/add";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import {
    inject,
    injectable
} from "inversify";

@injectable()
export class DevicesService {
    constructor ( @inject(DevicesSessionsRepository) protected devicesSessionsRepository: DevicesSessionsRepository ) {
    }

    /**
     * Создает новую сессию устройства.
     * @param userId Идентификатор пользователя (ObjectId).
     * @param deviceId Идентификатор устройства.
     * @param issuedAt Время создания токена.
     * @param ip IP-адрес устройства.
     * @param deviceName Название устройства.
     * @returns Промис с результатом добавления сессии устройства.
     */
    async createDeviceSession ( userId: ObjectId, deviceId: string, issuedAt: number, ip: string | null, deviceName?: string ) {
        const createDeviceSession: SessionDBModel = {
            deviceId: deviceId,
            issuedAt: issuedAt,
            userId: userId.toString(),
            ip: ip || null,
            title: deviceName || null,
            lastActiveDate: new Date().toISOString(),
            expirationDate: add(new Date(),
                {
                    seconds: 20
                    //minutes:20
                })
        }
        return await this.devicesSessionsRepository.addDeviceSession(createDeviceSession)
    }

    /**
     * Обновляет время создания (IAT) в сессии устройства.
     * @param newIssuedAt Новое время создания токена.
     * @param issuedAt Старое время создания токена.
     * @returns Промис с результатом обновления.
     */
    async updateIATByDeviceSession ( newIssuedAt: number, issuedAt: number ) {
        return await this.devicesSessionsRepository.updateDeviceSession(newIssuedAt,
            issuedAt)
    }

    /**
     * Выход из сессии устройства по его идентификатору и идентификатору пользователя.
     * @param deviceId Идентификатор устройства.
     * @param userId Идентификатор пользователя (строка).
     * @returns Промис с результатом удаления сессии устройства.
     */
    async logoutDeviceSessionByDeviceId ( deviceId: string, userId: string ) {
        const findDeviceSessionById = await this.devicesSessionsRepository.findDeviceIdAmongSessions(deviceId)
        if (!findDeviceSessionById) {
            return null
        }
        return await this.devicesSessionsRepository.deleteDeviceSessionSpecified(deviceId,
            userId)
    }

    /**
     * Выход из всех сессий устройств для указанного пользователя.
     * @param issuedAt Время создания токена.
     * @param userId Идентификатор пользователя (строка).
     * @returns Промис с результатом удаления сессий устройств.
     */
    async logoutDevicesSessionsByUser ( issuedAt: number, userId: string ) {
        const result = this.devicesSessionsRepository.deleteDevicesSessionsByUser(issuedAt,
            userId)
        return result
    }
}