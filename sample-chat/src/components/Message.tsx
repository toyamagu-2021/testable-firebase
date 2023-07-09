import { useUsers } from '@/contexts/UsersContext';
import {format} from 'date-fns';
import { LoadingScreen } from '@/components/LoadingScreen';
import {Message as MessageType} from '@/types/message';
import {useBlob} from '@/hooks/useBlob';
import nonameIcon from '@/images/noname.png';

export const Message = ({ message}: {message: MessageType}) => {
  const {usersById, loading} = useUsers();
  const sender = usersById[message.senderId];
  const {url} = useBlob(message.imagePath);

  if(loading) return <LoadingScreen/>;
  return (
    <div>
      <div>
        <img src={sender?.photoUrl || nonameIcon}/>
        <span>{sender?.name || 'nanashi'}</span>
        <span>
          {format(message.createdAt.toDate(), 'yyyy-MM-dd HH:mm')}
        </span>
      </div>
      <p>{message.content}</p>
      {url && <img alt="mssage-image" src={url} />}
    </div>
  );
};
