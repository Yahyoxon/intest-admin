import React, {useState} from 'react';

import {LoadMoreVisible, Spinner} from "components";
import Modal from "components/Modal";
import EntityContainer from "modules/entity/containers";
import EntityActions from "modules/entity/actions";

import { useNotification } from "hooks";
import {useDispatch} from "react-redux";
import {ReactComponent as EditIcon} from "assets/images/icons/edit.svg";
import {ReactComponent as DeleteIcon} from "assets/images/icons/delete.svg";
import get from "lodash/get";

const FmFolders = ({setActiveFolder}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingU, setLoadingU] = useState(false);
  const [updateModal, showUpdateModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [selected, setSelected] = useState(false);

  const dispatch = useDispatch();
  const { notification } = useNotification();

  const onEnter = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      addFolder();
      setLoadingU(true);
    }
  };
  const addFolder = () => {
    dispatch(EntityActions.Form.request({
      method: 'post',
      entity: 'filemanagerFolder',
      name: `all`,
      url: `/filemanager/folder`,
      primaryKey: "id",
      values: {title: newFolderName},
      prependData: true,
      normalizeData: data => data,
      cb: {
        success: () => {
          notification("Успешно", {
            type: "success"
          });
        },
        error: () => {
          notification("Успешно", {
            type: "danger"
          });
        },
        finally: () => {
          setLoadingU(false);
          setNewFolderName("");
        }
      }
    }))
  };

  const onEnterUpdate = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      setLoadingU(true);
      dispatch(EntityActions.Form.request({
        method: 'put',
        entity: 'filemanagerFolder',
        name: `all`,
        url: `/filemanager/folder/${get(selected, 'id')}`,
        primaryKey: "id",
        id: get(selected, 'id'),
        values: {title: event.target.value},
        prependData: true,
        normalizeData: data => data,
        cb: {
          success: () => {
            notification("Успешно", {
              type: "success"
            });
          },
          error: () => {
            notification("Успешно", {
              type: "danger"
            });
          },
          finally: () => {
            setLoadingU(false);
            showUpdateModal(false);
            setSelected(null);
          }
        }
      }))
    }
  };
  const onEdit = folder => {
    setSelected(folder);
    showUpdateModal(true);
  };
  const onDelete = folder => {
    setSelected(folder);
    showDeleteModal(true);
  };

  const deleteFile = folder => {
    setLoading(true);
    dispatch(EntityActions.Form.request({
      method: "delete",
      entity: 'filemanagerFolder',
      name: `all`,
      url: `/filemanager/folder/${folder.id}`,
      primaryKey: "id",
      id: folder.id,
      deleteData: true,
      cb: {
        success: () => {
          notification("Успешно", {
            type: "success"
          });
        },
        error: () => {
          notification("Успешно", {
            type: "danger"
          });
        },
        finally: () => {
          showDeleteModal(false)
          setLoading(false)
        }
      }
    }))
  };

  return (
    <div className="relative">
      {loadingU && (
          <Spinner name="oval" className="w-6 h-6"/>
      )}
      <Modal.Default
          className="z-index-2"
          toggle={updateModal}
          setToggle={() => showUpdateModal(false)}
          header="Изменить названия папку"
      >
        <input
            name="alt"
            className={`form-control`}
            defaultValue={get(selected, 'title')}
            placeholder="Создать новый папка"
            onKeyDown={(e) => onEnterUpdate(e)}
        />
      </Modal.Default>

      <Modal.Confirm
          className={"z-index-2"}
          isSubmitting={loading}
          title="Вы действительно хотите удалить?"
          toggle={deleteModal}
          setToggle={showDeleteModal}
          closable
          cancelText="нет"
          okText="да"
          onOk={() => deleteFile(selected)}
      />

      <div className="fm-folders">
        <EntityContainer.All
          entity="filemanagerFolder"
          name={`all`}
          url="/filemanager/folder"
          primaryKey="id"
          params={{
            sort: '-id',
            limit: 30,
            page
          }}
        >
          {({items, isFetched, meta}) => {
            return (
              <div className="folder-items">
                <div className="folder-item" onClick={() => setActiveFolder(null)}>Все</div>
                {items.map(folder => (
                  <div className="folder-item">
                    <span onClick={() => setActiveFolder(folder)}>{folder.title}</span>
                    <div className="action-buttons">
                      <div className="action-btn edit-btn" onClick={() => onEdit(folder)}>
                        <EditIcon height={16} width={16}/>
                      </div>
                      <div className="action-btn delete-btn" onClick={() => onDelete(folder)}>
                        <DeleteIcon height={16} width={16}/>
                      </div>
                    </div>
                  </div>
                ))}

                {isFetched && meta &&
                meta.currentPage < meta.pageCount && (
                  <LoadMoreVisible
                    setPage={() =>
                      setPage(meta.currentPage + 1)
                    }
                  />
                )}
              </div>
            );
          }}
        </EntityContainer.All>
        <div className="add-folder mt-2">
          <input
              name="alt"
              className={`form-control`}
              placeholder="Создать новый папка"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={(e) => onEnter(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default FmFolders;
