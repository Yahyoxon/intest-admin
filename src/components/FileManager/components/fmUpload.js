import React from 'react';
import Actions from "modules/entity/actions";
import {useDispatch} from "react-redux";
import {Fields} from "components";

const FmUpload = ({filterType, activeFolder}) => {
    const dispatch = useDispatch();

    const saveEntity = (data) => {
      dispatch(Actions.Append.request({
        entity: 'files',
        name: `allFiles-${filterType}`,
        data: data,
        primaryKey: 'id',
        appendIds: true,
        params: {
          limit: 12,
          sort: "-id",
        }
      }))
    };
    return (
      <div className="fm-upload">
          <Fields.FileUpload
              isDoc={true}
              limit={10}
              onChangeHandler={items => {
                  saveEntity(items)
              }}
          />
      </div>
    );
};

export default FmUpload;
