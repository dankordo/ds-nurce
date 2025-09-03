const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Функция для отправки уведомлений
exports.sendNotification = functions.database.ref('/pendingNotifications/{notificationId}')
    .onCreate(async (snapshot, context) => {
        const notificationData = snapshot.val();
        const notificationId = context.params.notificationId;
        
        // Получаем все активные токены
        const tokensSnapshot = await admin.database().ref('fcmTokens').once('value');
        const tokens = [];
        
        tokensSnapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().enabled) {
                tokens.push(childSnapshot.key);
            }
        });
        
        if (tokens.length === 0) {
            console.log('No active tokens found');
            // Удаляем pending notification
            return snapshot.ref.remove();
        }
        
        // Создаем сообщение
        const message = {
            notification: {
                title: 'Напоминание',
                body: notificationData.message || `Пора ${notificationData.itemName}!`,
            },
            tokens: tokens // Отправляем всем активным устройствам
        };
        
        try {
            // Отправляем уведомление
            const response = await admin.messaging().sendMulticast(message);
            console.log('Successfully sent message:', response);
            
            // Логируем результаты
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.error('Failure for token:', tokens[idx], resp.error);
                    // Если токен невалидный, удаляем его
                    if (resp.error.code === 'messaging/invalid-registration-token' || 
                        resp.error.code === 'messaging/registration-token-not-registered') {
                        admin.database().ref(`fcmTokens/${tokens[idx]}`).remove();
                    }
                }
            });
            
            // Обновляем статус уведомления
            await admin.database().ref(`sentNotifications/${notificationId}`).set({
                ...notificationData,
                status: 'sent',
                sentAt: admin.database.ServerValue.TIMESTAMP,
                tokensCount: tokens.length
            });
            
            // Удаляем pending notification
            return snapshot.ref.remove();
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Обновляем статус на error
            await admin.database().ref(`sentNotifications/${notificationId}`).set({
                ...notificationData,
                status: 'error',
                error: error.message,
                sentAt: admin.database.ServerValue.TIMESTAMP
            });
            
            return snapshot.ref.remove();
        }
    });

// Функция для очистки старых токенов (раз в день)
exports.cleanOldTokens = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const now = Date.now();
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);
    
    const tokensSnapshot = await admin.database().ref('fcmTokens').once('value');
    const updates = {};
    
    tokensSnapshot.forEach((childSnapshot) => {
        const tokenData = childSnapshot.val();
        if (tokenData.timestamp && tokenData.timestamp < twoWeeksAgo) {
            updates[childSnapshot.key] = null; // Удаляем старый токен
        }
    });
    
    await admin.database().ref('fcmTokens').update(updates);
    console.log(`Cleaned ${Object.keys(updates).length} old tokens`);
    return null;
});
