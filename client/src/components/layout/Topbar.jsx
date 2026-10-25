import { matchPath, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { NAV_ITEMS, SETTINGS_ITEM } from '../../utils/constants';
import Avatar from '../ui/Avatar';

export default function Topbar() {
  const { user } = useAuth();
  const { groups } = useData();
  const { openModal } = useModal();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const current = [...NAV_ITEMS, SETTINGS_ITEM].find((i) => matchPath({ path: i.to, end: !!i.end }, pathname));
  const eyebrow = current?.eyebrow || 'YOUR ACCOUNT';

  // If we're inside a group, "Add expense" should default to that group.
  const groupMatch = matchPath('/groups/:groupId', pathname);

  const quickExpense = () => {
    if (!groups.length) {
      toast('Create a group first, then add a shared expense.', true);
      navigate('/groups');
      openModal('group');
      return;
    }
    openModal('expense', { groupId: groupMatch?.params.groupId });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand-mobile">
          SplitSmart<span>.</span>
        </div>
        <div className="eyebrow">{eyebrow}</div>
      </div>
      <div className="top-actions">
        <button className="btn btn-outline" onClick={quickExpense}>
          ＋ <span className="hide-mobile">Add expense</span>
        </button>
        <Avatar name={user.name} />
      </div>
    </header>
  );
}
