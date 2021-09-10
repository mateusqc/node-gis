import { message } from 'antd';

export function showNotification(type, msg) {
  switch (type) {
    case 'success':
      message.success(msg ?? 'Sucesso!');
      break;
    case 'error':
      message.error(msg ?? 'Ocorreu um erro');
      break;
    case 'warning':
      message.warning(msg ?? 'Atenção!');
      break;
    default:
      message.info(msg ?? '');
      break;
  }
}
