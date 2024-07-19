"use client";
import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import InputGroup from "../FormElements/InputGroup";

interface Template {
  _id: string;
  name: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const SmsCampaign = () => {
  const [smstemplates, setTemplates] = useState<Template[] | undefined>(
    undefined,
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/sms");
        if (!response.ok) throw new Error("Failed to fetch sms templates");
        const data = await response.json();
        console.log("Fetched templates data:", data);
        setTemplates(data?.smstemplates); // Use optional chaining here
      } catch (error) {
        console.error("Error fetching sms templates:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const customerResponse = await fetch("/api/customers");
        if (!customerResponse.ok) throw new Error("Failed to fetch customers");
        const customerData = await customerResponse.json();
        console.log("Fetched customers data:", customerData);
        setCustomers(customerData?.customers); // Use optional chaining here
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchTemplates();
    fetchCustomers();
  }, []);

  useEffect(() => {
    console.log("Templates state updated:", smstemplates);
  }, [smstemplates]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const campaignData = {
      name,
      description,
      startDate,
      endDate,
      audience: selectedCustomers,
      templateId: selectedTemplate,
    };

    try {
      const response = await axios.post("/api/send-sms-campaign", campaignData);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign");
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
          <h3 className="font-semibold text-dark dark:text-white">
            SMS Campaign
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
              <InputGroup
                label="Campaign Name"
                placeholder="Campaign Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="Description"
                placeholder="Description"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                customClasses="w-full xl:w-1/2"
              />
            </div>
            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
              <InputGroup
                label="Start Date"
                placeholder="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="End Date"
                placeholder="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                customClasses="w-full xl:w-1/2"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                required
              >
                {smstemplates &&
                  smstemplates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4.5">
              <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                Audience
              </label>
              <select
                multiple
                value={selectedCustomers}
                onChange={(e) =>
                  setSelectedCustomers(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value,
                    ),
                  )
                }
                className="w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
                required
              >
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} ({customer.email}, {customer.phone})
                  </option>
                ))}
              </select>
            </div>
            <button className="w-full rounded bg-primary p-4 text-white hover:bg-opacity-90">
              Send Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SmsCampaign;
