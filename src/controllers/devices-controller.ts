import {
    Request,
    Response
} from "express";
import {
    DevicesService
} from "../domains/devices-service";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import {
    inject,
    injectable
} from "inversify";

@injectable()
export class DevicesController {

    constructor (@inject(DevicesSessionsRepository) protected devicesRepository: DevicesSessionsRepository,
                 @inject(DevicesService) protected devicesService: DevicesService) {
    }

    // Обработка запроса на получение устройств пользователя
    async getDevices ( req: Request, res: Response ) {
        const userId = req.userId.toString() // Получаем id пользователя из запроса
        const devicesSessionsByUser = await this.devicesRepository.findDevicesSessionsByUserId(userId) // Ищем устройства пользователя
        res.send(devicesSessionsByUser) // Отправляем список устройств
    }

    // Обработка запроса на удаление всех устройств пользователя
    async deleteDevices ( req: Request, res: Response ) {
        const userId = req.userId.toString() // Получаем id пользователя из запроса
        await this.devicesService.logoutDevicesSessionsByUser(req.issuedAt, userId) // Выход из всех устройств пользователя
        res.sendStatus(204) // Успешный статус: OK, без содержимого
        return
    }

    // Обработка запроса на удаление конкретного устройства по его id
    async deleteDevicesById ( req: Request, res: Response ) {
        const deviceId = req.params.deviceId // Получаем id устройства из запроса
        const userId = req.userId.toString() // Получаем id пользователя из запроса

        // Выход из конкретного устройства пользователя
        const logoutDeviceSession = await this.devicesService.logoutDeviceSessionByDeviceId(deviceId, userId)

        // Обработка различных сценариев удаления устройства
        if (logoutDeviceSession === null) {
            res.sendStatus(404) // Ошибка: Не найдено.
            return
        }
        if (!logoutDeviceSession) {
            res.sendStatus(403) // Ошибка: Запрещено (отказано в доступе).
            return
        }
        res.sendStatus(204) // Успешный статус: OK, без содержимого.
        return
    }
}
