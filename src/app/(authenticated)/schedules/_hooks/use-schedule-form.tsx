import { useEffect } from "react";
import { FormProps } from "antd";
import dayjs from "dayjs";

export const useScheduleForm = (
  formProps: FormProps,
  studioOptions: { value: string; label: string }[],
  form: any,
) => {
  useEffect(() => {
    if (formProps.initialValues) {
      const initialDate = formProps.initialValues.date
        ? dayjs(formProps.initialValues.date)
        : undefined;

      const initialTime = formProps.initialValues.showTime
        ? dayjs(formProps.initialValues.showTime, "HH:mm")
        : undefined;

      form.setFieldsValue({
        date: initialDate,
        showTime: initialTime,
        studioIds: formProps.initialValues.studios?.map((studio: any) => studio.id) || [],
        filmId: formProps.initialValues.foundFilm?.id,
      });
    }
  }, [formProps.initialValues, form]);

  const handleStudioChange = (selectedValues: string[]) => {
    const selectedIds = selectedValues.map((name) => {
      const studio = studioOptions.find((option) => option.value === name);
      return studio ? studio.value : name;
    });
    form.setFieldValue("studioIds", selectedIds);
  };

  const handleOnFinish = async (values: any) => {
    const showTime = dayjs(values.date)
      .set("hour", values.showTime.hour())
      .set("minute", values.showTime.minute())
      .set("second", 0)
      .toISOString();

    const formData = {
      scheduleId: formProps.initialValues?.id,
      filmId: values.filmId,
      studioIds: values.studioIds.map((id: string) => ({ id })),
      showTime,
    };
    formProps.onFinish?.(formData);
  };

  return { handleStudioChange, handleOnFinish };
};
