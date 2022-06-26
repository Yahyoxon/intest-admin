import React from "react";
import { withRouter } from "react-router-dom";
import { Field } from "formik";
import { Fields, Button } from "components";
import EntityForm from "modules/entity/forms";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
const Form = ({ showRejectModal, id }) => {
    const notification = useNotification();
    const history = useHistory();

    return (
        <EntityForm.Main
            method="put"
            entity="feedback-reject"
            name="all"
            url={`/feedback/reject/${id}`}
            primaryKey="id"
            normalizeData={data => data}
            id={id}
            onSuccess={(data, resetForm) => {
                resetForm();
                showRejectModal(false);
                history.replace("/statements");
                notification("Успешно обновлено", { type: "success"});
            }}
            onError={error => {
                let message = get(error, "message");
                notification(message, {
                    type: "danger"
                });
            }}
            fields={[
                {
                    name: "reject_message",
                    required: true,
                },
            ]}>
            {({ values, setFieldValue, isSubmitting }) => {
                return (
                    <>
                        <Field
                            component={Fields.Textarea}
                            rows="5"
                            name="reject_message"
                            type="text"
                            placeholder="Введите вашу описания"
                            label="Описания"
                        />
                        <div className="d-flex align-center justify-content-end">
                            <Button.Default type="primary" buttonType="button" onClick={() => showRejectModal(false)}>
                                Отменить
                            </Button.Default>
                            <Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
                                Отправить
                            </Button.Default>
                        </div>
                    </>
                );
            }}
        </EntityForm.Main>
    );
};

export default withRouter(Form);
