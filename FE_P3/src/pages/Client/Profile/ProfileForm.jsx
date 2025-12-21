import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Box, Button, Divider } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import AvatarSection from "./AvatarSection";
import BasicInfo from "./BasicInfo";
import MedicalInfo from "./MedicalInfo";
import { useTranslation } from "react-i18next";

const ProfileForm = ({ initialValues, onSubmit, onUploadAvatar }) => {
  const { t } = useTranslation("profile_client");
  const [isEditing, setIsEditing] = useState(false);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required(t("form.validation.fullName.required"))
      .min(3, t("form.validation.fullName.min")),

    phone: Yup.string()
      .required(t("form.validation.phone.required"))
      .matches(/^[0-9+]{9,15}$/, t("form.validation.phone.invalid")),

    dateOfBirth: Yup.date()
      .required(t("form.validation.dateOfBirth.required"))
      .max(new Date(), t("form.validation.dateOfBirth.future")), // ❌ không được chọn ngày tương lai

    medicalConditions: Yup.array()
      .min(1, t("form.validation.medicalConditions.min"))
      .of(
        Yup.object().shape({
          name: Yup.string().required(
            t("form.validation.medicalConditions.nameRequired")
          ),
          status: Yup.string().required(
            t("form.validation.medicalConditions.statusRequired")
          ),
          diagnosedDate: Yup.date()
            .nullable()
            .required(
              t("form.validation.medicalConditions.diagnosedDateRequired")
            ),
        })
      ),

    allergies: Yup.array()
      .min(1, t("form.validation.allergies.min"))
      .of(
        Yup.object().shape({
          name: Yup.string().required(
            t("form.validation.allergies.nameRequired")
          ),
          severity: Yup.string().required(
            t("form.validation.allergies.severityRequired")
          ),
        })
      ),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        await onSubmit(values, helpers);
        setIsEditing(false);
      }}
    >
      {(formikProps) => (
        <Form>
          <Grid container spacing={4}>
            <Box display="flex" gap={3}>
              <Box flex={4} display="flex" flexDirection="column" gap={2}>
                <AvatarSection
                  formik={formikProps}
                  isEditing={isEditing}
                  onUpload={onUploadAvatar}
                />
              </Box>

              <Box flex={8}>
                <BasicInfo formik={formikProps} isEditing={isEditing} />

                <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

                <MedicalInfo formik={formikProps} isEditing={isEditing} />

                <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

                <Box display="flex" justifyContent="flex-end" mb={2}>
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      {t("form.actions.edit")}
                    </Button>
                  ) : (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          formikProps.resetForm();
                          setIsEditing(false);
                        }}
                      >
                        {t("form.actions.cancel")}
                      </Button>

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                        type="submit"
                        disabled={formikProps.isSubmitting}
                      >
                        {t("form.actions.save")}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
