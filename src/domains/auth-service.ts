import { UserViewModel } from "../models/modelsUsersLogin/user-view";
import { UserDBType } from "../models/modelsUsersLogin/user-input";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { usersRepository } from "../repositories/db/users-db-repository";
import { emailsManager } from "../compositions-root";
import { WithId } from "mongodb";
import bcrypt from "bcrypt";
import {
    inject,
    injectable
} from "inversify";
import { EmailsManager } from "../adapter/emails-manager";

@injectable()
export class AuthService {
    constructor ( @inject(EmailsManager) protected emailsManager: EmailsManager ) {
    }

    /**
     * Регистрация нового пользователя.
     * @param login Логин нового пользователя.
     * @param password Пароль нового пользователя.
     * @param email Адрес электронной почты нового пользователя.
     * @returns Объект UserViewModel, представляющий зарегистрированного пользователя, или null в случае ошибки.
     */
    async userRegistration ( login: string, password: string, email: string ): Promise<UserViewModel | null> {
        // Генерация хеша пароля
        const hash = await this._generateHash(password);

        // Создание нового пользователя с подготовленными данными
        const newUser: UserDBType = {
            login: login,
            passwordHash: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),
                    {
                        hours: 1,
                        minutes: 10
                    }),
                isConfirmed: false
            }
        };

        // Добавление нового пользователя в базу данных
        const result = await usersRepository.addNewUser(newUser);

        try {
            // Отправка сообщения для подтверждения адреса электронной почты
            await emailsManager.sendEmailConformationMessage(email,
                newUser.emailConfirmation.confirmationCode);
        } catch (error) {
            console.error(error);

            // В случае ошибки удаление пользователя из базы данных
            await usersRepository.userByIdDelete(result.id);
            return null;
        }

        return result;
    }

    /**
     * Восстановление пароля пользователя.
     * @param password Новый пароль для пользователя.
     * @param code Код подтверждения восстановления пароля.
     * @returns true, если восстановление пароля успешно, false в случае ошибки.
     */
    async passwordRecovery ( password: string, code: string ): Promise<boolean | null> {
        // Проверка подтверждения кода восстановления
        const isConfirmed = await this.confirmCode(code);
        // Проверка наличия пользователей с данным кодом
        const isOneUser = await usersRepository.getUsersByConfirmationCode(code);

        if (!isConfirmed && isOneUser) {
            return null;
        }

        // Генерация хеша нового пароля
        const hash = await this._generateHash(password);

        // Обновление хеша пароля в базе данных
        return usersRepository.updatePasswordHash(hash,
            code);
    }

    /**
     * Подтверждение кода подтверждения электронной почты пользователя.
     * @param code Код подтверждения электронной почты.
     * @returns true, если код успешно подтвержден, false в случае ошибки.
     */
    async confirmCode ( code: string ): Promise<boolean> {
        // Обновление кода подтверждения в базе данных
        return await usersRepository.updateConfirmCode(code);
    }

    /**
     * Повторная отправка подтверждающего сообщения на электронную почту.
     * @param email Адрес электронной почты пользователя.
     * @returns true, если сообщение успешно отправлено, false в случае ошибки.
     */
    async emailResending ( email: string ): Promise<boolean> {
        // Генерация нового кода подтверждения
        const newCode = uuidv4();

// Обновление кода подтверждения в базе данных
        const codeReplacement = await usersRepository.updateConfirmationCodeByEmail(email,
            newCode);

        if (!codeReplacement) {
            return false;
        }

        try {
            // Отправка сообщения для подтверждения адреса электронной почты
            await this.emailsManager.sendEmailConformationMessage(email,
                newCode);
        } catch (error) {
            const user = await usersRepository.findByLoginOrEmail(email);
            await usersRepository.userByIdDelete(user!._id.toString()); // Email не подтвержден! User валидируется в верхних слоях express-валидатора.
            console.error(error);
            return false;
        }

        return true;
    }

    /**
     * Отправка сообщения о восстановлении пароля на электронную почту.
     * @param email Адрес электронной почты пользователя.
     * @returns true, если сообщение успешно отправлено, false в случае ошибки.
     */
    async sendPasswordRecovery ( email: string ): Promise<boolean> {
        // Генерация нового кода подтверждения
        const newCode = uuidv4();

        // Обновление кода подтверждения в базе данных
        const codeReplacement = await usersRepository.updateConfirmationCodeByEmail(email,
            newCode);

        if (!codeReplacement) {
            return false;
        }

        try {
            // Отправка сообщения о восстановлении пароля
            await this.emailsManager.sendEmailPasswordRecovery(email,
                newCode);
        } catch (error) {
            const user = await usersRepository.findByLoginOrEmail(email);
            await usersRepository.userByIdDelete(user!._id.toString()); // Email подтвержден! User валидируется при запросе на эндпоинт express-валидатором.
            console.error(error);
            return false;
        }

        return true;
    }

    /**
     * Проверка учетных данных (логин/электронная почта и пароль) пользователя.
     * @param loginOrEmail Логин или адрес электронной почты пользователя.
     * @param password Пароль пользователя.
     * @returns Объект WithId<UserDBType>, представляющий пользователя, если учетные данные верны, или null в случае ошибки.
     */
    async checkCredentials ( loginOrEmail: string, password: string ): Promise<WithId<UserDBType> | null> {
        // Поиск пользователя по логину или адресу электронной почты
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user || !user.emailConfirmation.isConfirmed) {
            return null;
        }

        // Проверка соответствия хеша пароля
        const isHashesEquals = await this._isPasswordCorrect(password,
            user.passwordHash);
        if (isHashesEquals) {
            return user;
        } else{
            return null;
        }
    }

    /**
     * Генерация хеша пароля.
     * @param password Пароль, для которого нужно сгенерировать хеш.
     * @returns Хеш пароля.
     */
    async _generateHash ( password: string ): Promise<string> {
        return await bcrypt.hash(password,
            7);
    }

    /**
     * Проверка соответствия пароля и хеша.
     * @param password Пароль для сравнения.
     * @param hash Хеш, с которым нужно сравнить пароль.
     * @returns true, если пароль соответствует хешу, false в противном случае.
     */
    async _isPasswordCorrect ( password: string, hash: string ): Promise<boolean> {
        return await bcrypt.compare(password,
            hash);
    }
}