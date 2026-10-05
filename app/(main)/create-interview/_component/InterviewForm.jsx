"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import Link from "next/link";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const interviewTypes = [
  { label: "Technical", value: "technical" },
  { label: "Behavioral", value: "behavioral" },
  { label: "Experience", value: "experience" },
  { label: "Problem Solving", value: "problem-solving" },
  { label: "Leadership", value: "leadership" },
];

const validationSchema = Yup.object({
  jobPosition: Yup.string().required("Job Position is required"),
  jobDescription: Yup.string().required("Job Description is required"),
  duration: Yup.string().required("Duration is required"),
  selectedTypes: Yup.array()
    .min(1, "Select at least one interview type")
    .required("Select at least one interview type"),
});

export default function InterviewForm({
  handleGenerate,
  loading,
  setFormData,
  formData,
}) {
  // Sync Formik initial values with external formData and selectedTypes updates
  // (optional, depending on your app's data flow)
  useEffect(() => {
    // This effect can be used if formData or selectedTypes change outside Formik
    // and you want to reset Formik values accordingly.
  }, [formData]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        jobPosition: formData.jobPosition || "",
        jobDescription: formData.jobDescription || "",
        duration: formData.duration || "15",
        selectedTypes: formData.selectedTypes || [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setFormData(values);
        handleGenerate(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="mx-auto p-6 space-y-6">
          {/* Job Position */}
          <div>
            <label className="block font-medium mb-1">Job Position</label>
            <Field name="jobPosition">
              {({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. Senior Frontend Developer"
                />
              )}
            </Field>
            <ErrorMessage
              name="jobPosition"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block font-medium mb-1">Job Description</label>
            <Field name="jobDescription">
              {({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter detailed job description..."
                />
              )}
            </Field>
            <ErrorMessage
              name="jobDescription"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Interview Duration */}
          <div>
            <label className="block font-medium mb-1">Interview Duration</label>
            <Select
              onValueChange={(val) => setFieldValue("duration", val)}
              value={values.duration}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage
              name="duration"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Interview Types */}
          <div>
            <label className="block font-medium mb-2">Interview Types</label>
            <div className="flex flex-wrap gap-2">
              {interviewTypes.map((type) => {
                const isSelected = values.selectedTypes.includes(type.value);
                return (
                  <Badge
                    key={type.value}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      let newSelectedTypes;
                      if (isSelected) {
                        newSelectedTypes = values.selectedTypes.filter(
                          (v) => v !== type.value
                        );
                      } else {
                        newSelectedTypes = [...values.selectedTypes, type.value];
                      }
                      setFieldValue("selectedTypes", newSelectedTypes);
                    }}
                  >
                    {type.label}
                  </Badge>
                );
              })}
            </div>
            <ErrorMessage
              name="selectedTypes"
              component="div"
              className="text-red-600 text-sm mt-1"
            />
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-blue-600 text-sm mt-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Generating Interview Questions
              </div>
              <p className="text-xs mt-1 text-gray-500">
                Our AI is crafting personalized questions based on your
                requirements...
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Link href={"/dashboard"} className="cursor-pointer">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="cursor-pointer" disabled={loading}>
              Generate Questions →
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
