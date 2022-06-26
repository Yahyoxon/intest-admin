import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withFormik } from "formik";
import * as Yup from "yup";
import get from "lodash/get";
import isArray from "lodash/isArray";
import objectToFormData from "object-to-formdata";
import PropTypes from "prop-types";
import Actions from "../actions";
import {isNumber} from 'lodash';

const Main = ({
    children,
    handleSubmit,
    submitForm,
    values,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    errors,
    formID
}) => (
    <form onSubmit={handleSubmit} id={formID} autoComplete={"false"}>
        {children({ handleSubmit, submitForm, values, isSubmitting, setFieldValue, setFieldError, setFieldTouched, errors})}
    </form>
);

Main.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    entity: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    method: PropTypes.oneOf(['get', 'post', 'put', 'delete']).isRequired,
    primaryKey: PropTypes.string,
    fields: PropTypes.array.isRequired,
    appendData: PropTypes.bool,
    prependData: PropTypes.bool,
    updateData: PropTypes.bool,
    deleteData: PropTypes.bool,
    normalizeData: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    sendAsFormData: PropTypes.bool,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    isMulti: PropTypes.bool,
};

Main.defaultProps = {
    primaryKey: "id",
    appendData: false,
    prependData: false,
    updateData: false,
    deleteData: false,
    normalizeData: data => data,
    sendAsFormData: true,
    isMulti: false,
    onSuccess: () => {
    },
    onError: () => {
    },
};

const EnhacedForm = withFormik({
    enableReinitialize: true,
    validationSchema: ({ fields }) => {

        if (!isArray(fields)) {
            return Yup.object().shape({});
        }

        let validationFields = {};

        fields.forEach(field => {
            let validationField;

            switch (field.type) {
                case "string":
                    validationField = Yup.string().typeError("Должна быть строка");
                    break;
                case "object":
                    validationField = Yup.object();
                    break;
                case "number":
                    validationField = Yup.number().typeError("Должно быть число");
                    break;
                case "array":
                    validationField = Yup.array();
                    break;
                case "boolean":
                    validationField = Yup.boolean();
                    break;
                case "date":
                    validationField = Yup.date();
                    break;
                default:
                    validationField = Yup.string()
            }

            if (field.required) {
                validationField = validationField.required("Поле должно быть заполнено");
            }

            if (field.min) {
                validationField = validationField.min(field.min, "Слишком короткий!");
            }

            if (field.max) {
                validationField = validationField.max(field.max, "Слишком длинный!");
            }

            if (field.type === "number" && isNumber(field.moreThan)) {
                validationField = validationField.moreThan(field.moreThan, "Must be more than!");
            }

            if (field.type === "number" && isNumber(field.lessThan)) {
                validationField = validationField.lessThan(field.lessThan, "Must be less than!");
            }

            validationField = validationField.nullable();

            validationFields[field.name] = validationField;
        });

        return Yup.object().shape(validationFields);
    },
    mapPropsToValues: ({ fields }) => {
        return isArray(fields) ? fields.reduce((prev, curr) => ({
            ...prev,
            [curr.name]: curr.isAbsolute ? curr.value : get(curr, 'value', "")
        }), {}) : {};
    },
    handleSubmit: (values, { props, setFieldError, setSubmitting, resetForm }) => {

        let {
            id,
            entity,
            name,
            url,
            params,
            method,
            primaryKey,
            isMulti,
            fields,
            appendData,
            prependData,
            updateData,
            deleteData,
            normalizeData,
            sendAsFormData,
            onSuccess = () => {
            },
            onError = () => {
            },
            FormAction,
        } = props;

        values = { ...values };

        if (typeof url === "function") {
            url = url({ ...values });
        }

        fields.forEach(field => {
            if (field.hasOwnProperty("onSubmitValue")) {
                if (typeof field.onSubmitValue === "function") {
                    if (field.hasOwnProperty("onSubmitKey")) {
                        values[field.onSubmitKey] = field.onSubmitValue(values[field.name], values);
                        delete values[field.name];
                    } else {
                        values[field.name] = field.onSubmitValue(values[field.name], values);
                    }
                }
            }
            if (field.hasOwnProperty("disabled")) {
                delete values[field.name];
            }
        });

        if (sendAsFormData) {
            values = objectToFormData(values);
        }

        FormAction({
            id,
            entity,
            name,
            url,
            params,
            method,
            primaryKey,
            values,
            isMulti,
            appendData,
            prependData,
            updateData,
            deleteData,
            normalizeData,
            cb: {
                success: (data) => {
                    onSuccess(data, resetForm);
                },
                error: (errors = []) => {
                    const errorsE = get(errors, 'errors')

                    if (errors instanceof Array) {
                        errors.map(({ field, message }) => setFieldError(field, message));
                    } else if (errorsE instanceof Object) {
                        Object.keys(errorsE).map(field => {
                            const error = errorsE[field][0];
                            return setFieldError(field, error);
                        });
                    }

                    onError(errors, setFieldError);
                },
                finally: () => {
                    setSubmitting(false);
                }
            }
        });

    }
})(Main);

const mapDispatchToProps = (dispatch) => bindActionCreators(
    {
        FormAction: Actions.Form.request
    },
    dispatch
);

export default connect(null, mapDispatchToProps)(EnhacedForm);
