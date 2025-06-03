"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { insertUserAnswers } from "@/lib/userAnswers";

export default function QuestionnarieForm() {
  const [formData, setFormData] = useState({
    training_experience: "",
    availability: "",
    injuries: "",
    equipment_access: false,
    goal: "",
    fitness_level: "",
    session_duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        availability: formData.availability.toString(),
        session_duration: formData.session_duration.toString(),
      };

      await insertUserAnswers(payload);
      setSuccess(true);
      setFormData({
        training_experience: "",
        availability: "",
        injuries: "",
        equipment_access: false,
        goal: "",
        fitness_level: "",
        session_duration: "",
      });
    } catch (err: any) {
      setError(err.message || "Error inserting data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Training Questionnaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experience */}
          <div className="space-y-2">
            <Label>How long have you been training?</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("training_experience", value)
              }
              value={formData.training_experience}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Never trained</SelectItem>
                <SelectItem value="little">Less than 6 months</SelectItem>
                <SelectItem value="moderate">6 months - 2 years</SelectItem>
                <SelectItem value="advanced">More than 2 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>How many days a week can you train?</Label>
            <Input
              type="number"
              name="availability"
              placeholder="e.g. 3"
              min={1}
              max={7}
              value={formData.availability}
              onChange={handleChange}
            />
          </div>

          {/* Session Duration */}
          <div className="space-y-2">
            <Label>How much time can you dedicate per session (minutes)?</Label>
            <Input
              type="number"
              name="session_duration"
              placeholder="e.g. 45"
              value={formData.session_duration}
              onChange={handleChange}
            />
          </div>

          {/* Injuries */}
          <div className="space-y-2">
            <Label>Do you have any injuries or conditions to consider?</Label>
            <Textarea
              name="injuries"
              placeholder="Describe your limitations if any"
              value={formData.injuries}
              onChange={handleChange}
            />
          </div>

          {/* Equipment Access */}
          <div className="space-y-2">
            <Label>Do you have access to equipment or gym?</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("equipment_access", value === "true")
              }
              value={formData.equipment_access.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <Label>What is your main goal?</Label>
            <Select
              onValueChange={(value) => handleSelectChange("goal", value)}
              value={formData.goal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gain">Gain muscle mass</SelectItem>
                <SelectItem value="lose">Lose fat</SelectItem>
                <SelectItem value="maintain">Maintain fitness</SelectItem>
                <SelectItem value="health">Improve general health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fitness Level */}
          <div className="space-y-2">
            <Label>How would you describe your current fitness level?</Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("fitness_level", value)
              }
              value={formData.fitness_level}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your current level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && (
            <p className="text-green-600">Answers saved successfully!</p>
          )}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save answers"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
