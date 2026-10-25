import { createContext, useCallback, useContext, useState } from 'react';
import GroupModal from '../components/modals/GroupModal';
import ExpenseModal from '../components/modals/ExpenseModal';
import PersonalExpenseModal from '../components/modals/PersonalExpenseModal';
import SettlementModal from '../components/modals/SettlementModal';

const ModalContext = createContext(null);
export const useModal = () => useContext(ModalContext);

const MODALS = {
  group: GroupModal,
  expense: ExpenseModal,
  personal: PersonalExpenseModal,
  settlement: SettlementModal,
};

/**
 * Any component can open a dialog:
 *   const { openModal } = useModal();
 *   openModal('expense', { groupId });
 */
export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null); // { type, props }
  const openModal = useCallback((type, props = {}) => setModal({ type, props }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const Active = modal ? MODALS[modal.type] : null;
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {Active && <Active {...modal.props} onClose={closeModal} />}
    </ModalContext.Provider>
  );
}
