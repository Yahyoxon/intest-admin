import React from "react";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import Form from "./form";

const Create = ({ setCreateModal, regionId }) => {
    const { notification } = useNotification();
    return (
        <EntityForm.Main
            method="post"
            entity="districts"
            name="all"
            url={`/district`}
            primaryKey="id"
            prependData={true}
            normalizeData={data => data}
            onSuccess={(data, resetForm) => {
                resetForm();
                setCreateModal(false);
                notification("Успешно обновлено", {
                    type: "success"
                });
            }}
            onError={() => {
                notification("Что-то пошло не так", {
                    type: "danger"
                });
            }}
            fields={[
                {
                    name: "name_uz",
                    required: true,
                },
                {
                    name: "name_ru",
                    required: true,
                },
                {
                    name: "name_en",
                },
                {
                    name: "code",
                    required: true,
                },
                {
                    name: 'region_id',
                    value: regionId
                }
            ]}>
            {({ isSubmitting, values, setFieldValue }) => {
                return (
                    <>
                        <Form
                            {...{
                                values,
                                isSubmitting,
                                setFieldValue,
                                setCreateModal,
                                isDistrict: true
                            }}
                        />
                    </>
                );
            }}
        </EntityForm.Main>
    );
};

export default Create;
