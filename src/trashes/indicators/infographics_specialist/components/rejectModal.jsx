import React from "react";
import { Button, Fields } from "components";
import EntityForm from "modules/entity/forms";
import { Field } from "formik";

const RejectModal = ({ closeCheckModal, setRejectModal, selected }) => {
	return (
		<div className="modalRefusel-inner">
			<EntityForm.Main
				method="post"
				entity="statisticsTicket"
				name="all"
				url={`/statistics-ticket/reject/${selected.id}`}
				updateData={true}
				params={{
					include: 'values.option,user,moderator.user'
				}}
				id={selected.id}
				primaryKey="id"
				normalizeData={data => data}
				onSuccess={(data, resetForm) => {
					resetForm();
					setRejectModal(false);
					closeCheckModal()
				}}
				onError={() => {

				}}
				fields={[
					{
						name: "comment",
						value: "",
						required: true
					}
				]}>
				{({ isSubmitting, values, setFieldValue }) => {
					return (
						<div>
							<span className="modalRefusel-inner-span" onClick={() => setRejectModal(false)}>
								X
							</span>
							<h1 className="mb-5">
								<span />Причина отказа
							</h1>
							<Field
								component={Fields.Textarea}
								name="comment"
								placeholder="Введите причина отказа"
							/>

							<div className="text-right">
								<Button.Default
									buttonType={"submit"}
									className="mr-0"
									loading={isSubmitting}
									disabled={isSubmitting}
								>Ок</Button.Default>
							</div>
						</div>
					);
				}}
			</EntityForm.Main>


		</div>
	);
};

export default RejectModal;