'use client';
import { saveJobAction } from "@/app/actions/jobActions";
import ImageUpload from "@/app/components/ImageUpload";
import type { Job } from "@/models/Job";
import { faEnvelope, faMobile, faPerson, faPhone, faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RadioGroup, TextArea, TextField, Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";
import { useState } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import { useRouter } from 'next/navigation';
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

export default function JobForm({ orgId, jobDoc }: { orgId: string; jobDoc?: Job }) {
  const [countryId, setCountryId] = useState(jobDoc?.countryId || 0);
  const [stateId, setStateId] = useState(jobDoc?.stateId || 0);
  const [cityId, setCityId] = useState(jobDoc?.cityId || 0);
  const [countryName, setCountryName] = useState(jobDoc?.country || '');
  const [stateName, setStateName] = useState(jobDoc?.state || '');
  const [cityName, setCityName] = useState(jobDoc?.city || '');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  async function handleSaveJob(data: FormData) {
    let hasError = false;
    const requiredFields = ['title', 'contactName', 'contactEmail', 'description'];

    // Reset errors
    setErrors({});

    requiredFields.forEach(field => {
      if (!data.get(field)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [field]: `${field} is required`
        }));
        hasError = true;
      }
    });

    if (hasError) return; // Prevent form submission if there are validation errors

    data.set('country', countryName.toString());
    data.set('state', stateName.toString());
    data.set('city', cityName.toString());
    data.set('countryId', countryId.toString());
    data.set('stateId', stateId.toString());
    data.set('cityId', cityId.toString());
    data.set('orgId', orgId);
    console.log("FormData after setting additional fields:", Object.fromEntries(data.entries()));
    try {
      const jobDoc = await saveJobAction(data);
      console.log("Job saved successfully:", jobDoc);
      console.log("Response from saveJobAction:", jobDoc);
  
      // Redirect after successful job save
      console.log("Redirecting to:", `/jobs/${jobDoc.orgId}`);
      router.push(`/jobs/${jobDoc.orgId}`);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  
  }

  return (
    <Theme>
      <form
        action={handleSaveJob}
        className="container mt-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault(); // prevent the form from submitting immediately
          const formData = new FormData(e.currentTarget as HTMLFormElement);
          handleSaveJob(formData);
        }}
      >
        {jobDoc && <input type="hidden" name="id" value={jobDoc?._id} />}

        <div className="form-group">
          <TextField.Root
            name="title"
            placeholder="Job title"
            defaultValue={jobDoc?.title || ''}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-6 *:grow">
          <div>
            Remote?
            <RadioGroup.Root defaultValue={jobDoc?.remote || 'hybrid'} name="remote">
              <RadioGroup.Item value="onsite">On-site</RadioGroup.Item>
              <RadioGroup.Item value="hybrid">Hybrid-remote</RadioGroup.Item>
              <RadioGroup.Item value="remote">Fully remote</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
          <div>
            Full time?
            <RadioGroup.Root defaultValue={jobDoc?.type || 'full'} name="type">
              <RadioGroup.Item value="project">Project</RadioGroup.Item>
              <RadioGroup.Item value="part">Part-time</RadioGroup.Item>
              <RadioGroup.Item value="full">Full-time</RadioGroup.Item>
            </RadioGroup.Root>
          </div>
          <div>
            Salary
            <TextField.Root name="salary" defaultValue={jobDoc?.salary || ''}>
              <TextField.Slot>DA</TextField.Slot>
              <TextField.Slot>Month</TextField.Slot>
            </TextField.Root>
          </div>
        </div>

        <div>
          Location
          <div className="flex flex-col sm:flex-row gap-4 *:grow">
            <CountrySelect
              defaultValue={countryId ? { id: countryId, name: countryName } : 0}
              onChange={(e: any) => {
                setCountryId(e.id);
                setCountryName(e.name);
              }}
              placeHolder="Select Country"
            />
            <StateSelect
              defaultValue={stateId ? { id: stateId, name: stateName } : 0}
              countryid={countryId}
              onChange={(e: any) => {
                setStateId(e.id);
                setStateName(e.name);
              }}
              placeHolder="Select State"
            />
            <CitySelect
              defaultValue={cityId ? { id: cityId, name: cityName } : 0}
              countryid={countryId}
              stateid={stateId}
              onChange={(e: any) => {
                setCityId(e.id);
                setCityName(e.name);
              }}
              placeHolder="Select City"
            />
          </div>
        </div>

        <div className="sm:flex">
          <div className="w-1/3">
            <h3>Job icon</h3>
            <ImageUpload name="jobIcon" icon={faStar} defaultValue={jobDoc?.jobIcon || ''} />
          </div>
          <div className="grow">
            <h3>Contact person</h3>
            <div className="flex gap-2">
              <div>
                <ImageUpload name="contactPhoto" icon={faUser} defaultValue={jobDoc?.contactPhoto || ''} />
              </div>
              <div className="grow flex flex-col gap-1">
                <TextField.Root
                  placeholder="John Doe"
                  name="contactName"
                  defaultValue={jobDoc?.contactName || ''}
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faUser} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.contactName && <p className="text-red-500">{errors.contactName}</p>}

                <TextField.Root
                  placeholder="Phone"
                  type="tel"
                  name="contactPhone"
                  defaultValue={jobDoc?.contactPhone || ''}
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faPhone} />
                  </TextField.Slot>
                </TextField.Root>

                <TextField.Root
                  placeholder="Email"
                  type="email"
                  name="contactEmail"
                  defaultValue={jobDoc?.contactEmail || ''}
                >
                  <TextField.Slot>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </TextField.Slot>
                </TextField.Root>
                {errors.contactEmail && <p className="text-red-500">{errors.contactEmail}</p>}
              </div>
            </div>
          </div>
        </div>

        <TextArea
          defaultValue={jobDoc?.description || ''}
          placeholder="Job description"
          resize="vertical"
          name="description"
        />
        {errors.description && <p className="text-red-500">{errors.description}</p>}

        <div className="flex justify-center">
          <Button size="3">
            <span className="px-8">Save</span>
          </Button>
        </div>
      </form>
    </Theme>
  );
}





// use client';
// import {saveJobAction} from "@/app/actions/jobActions";
// import ImageUpload from "@/app/components/ImageUpload";
// import type {Job} from "@/models/Job";
// import {faEnvelope, faMobile, faPerson, faPhone, faStar, faUser} from "@fortawesome/free-solid-svg-icons";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {Button, RadioGroup, TextArea, TextField, Theme} from "@radix-ui/themes";
// import {redirect} from "next/navigation";
// import {useState} from "react";
// import "react-country-state-city/dist/react-country-state-city.css";
// import {
//   CitySelect,
//   CountrySelect,
//   StateSelect,
// } from "react-country-state-city";



// export default function JobForm({orgId,jobDoc}:{orgId:string;jobDoc?:Job}) {
//   const [countryId, setCountryId] = useState(jobDoc?.countryId || 0);
//   const [stateId, setStateId] = useState(jobDoc?.stateId || 0);
//   const [cityId, setCityId] = useState(jobDoc?.cityId || 0);
//   const [countryName, setCountryName] = useState(jobDoc?.country || '');
//   const [stateName, setStateName] = useState(jobDoc?.state || '');
//   const [cityName, setCityName] = useState(jobDoc?.city || '');

//   async function handleSaveJob(data:FormData) {
//     data.set('country', countryName.toString());
//     data.set('state', stateName.toString());
//     data.set('city', cityName.toString());
//     data.set('countryId', countryId.toString());
//     data.set('stateId', stateId.toString());
//     data.set('cityId', cityId.toString());
//     data.set('orgId', orgId);
//     const jobDoc = await saveJobAction(data);
//     redirect(/jobs/${jobDoc.orgId});
//   }

//   return (
//     <Theme>
//       <form
//         action={handleSaveJob}
//         className="container mt-6 flex flex-col gap-4"
//       >
//         {jobDoc && (
//           <input type="hidden" name="id" value={jobDoc?._id}/>
//         )}
//         <TextField.Root name="title" placeholder="Job title" defaultValue={jobDoc?.title || ''}/>
//         <div className="grid sm:grid-cols-3 gap-6 *:grow">
//           <div>
//             Remote?
//             <RadioGroup.Root defaultValue={jobDoc?.remote || 'hybrid'} name="remote">
//               <RadioGroup.Item value="onsite">On-site</RadioGroup.Item>
//               <RadioGroup.Item value="hybrid">Hybrid-remote</RadioGroup.Item>
//               <RadioGroup.Item value="remote">Fully remote</RadioGroup.Item>
//             </RadioGroup.Root>
//           </div>
//           <div>
//             Full time?
//             <RadioGroup.Root defaultValue={jobDoc?.type || 'full'} name="type">
//               <RadioGroup.Item value="project">Project</RadioGroup.Item>
//               <RadioGroup.Item value="part">Part-time</RadioGroup.Item>
//               <RadioGroup.Item value="full">Full-time</RadioGroup.Item>
//             </RadioGroup.Root>
//           </div>
//           <div>
//             Salary
//             <TextField.Root name="salary" defaultValue={jobDoc?.salary || ''}>
//               <TextField.Slot>
//                 $
//               </TextField.Slot>
//               <TextField.Slot>
//                 k/year
//               </TextField.Slot>
//             </TextField.Root>
//           </div>
//         </div>
//         <div>
//           Location
//           <div className="flex flex-col sm:flex-row gap-4 *:grow">
//             <CountrySelect
//               defaultValue={countryId ? {id:countryId,name:countryName} : 0}
//               onChange={(e:any) => {
//                 setCountryId(e.id);
//                 setCountryName(e.name);
//               }}
//               placeHolder="Select Country"
//             />
//             <StateSelect
//               defaultValue={stateId ? {id:stateId,name:stateName} : 0}
//               countryid={countryId}
//               onChange={(e:any) => {
//                 setStateId(e.id);
//                 setStateName(e.name);
//               }}
//               placeHolder="Select State"
//             />
//             <CitySelect
//               defaultValue={cityId ? {id:cityId,name:cityName} : 0}
//               countryid={countryId}
//               stateid={stateId}
//               onChange={(e:any) => {
//                 setCityId(e.id);
//                 setCityName(e.name);
//               }}
//               placeHolder="Select City"
//             />
//           </div>

//         </div>
//         <div className="sm:flex">
//           <div className="w-1/3">
//             <h3>Job icon</h3>
//             <ImageUpload name="jobIcon" icon={faStar} defaultValue={jobDoc?.jobIcon || ''} />
//           </div>
//           <div className="grow">
//             <h3>Contact person</h3>
//             <div className="flex gap-2">
//               <div className="">
//                 <ImageUpload name="contactPhoto" icon={faUser} defaultValue={jobDoc?.contactPhoto || ''} />
//               </div>
//               <div className="grow flex flex-col gap-1">
//                 <TextField.Root
//                   placeholder="John Doe"
//                   name="contactName"
//                   defaultValue={jobDoc?.contactName || ''}>
//                   <TextField.Slot>
//                     <FontAwesomeIcon icon={faUser}/>
//                   </TextField.Slot>
//                 </TextField.Root>
//                 <TextField.Root
//                   placeholder="Phone"
//                   type="tel"
//                   name="contactPhone"
//                   defaultValue={jobDoc?.contactPhone || ''}
//                 >
//                   <TextField.Slot>
//                     <FontAwesomeIcon icon={faPhone}/>
//                   </TextField.Slot>
//                 </TextField.Root>
//                 <TextField.Root
//                   placeholder="Email"
//                   type="email"
//                   name="contactEmail"
//                   defaultValue={jobDoc?.contactEmail || ''}
//                 >
//                   <TextField.Slot>
//                     <FontAwesomeIcon icon={faEnvelope}/>
//                   </TextField.Slot>
//                 </TextField.Root>
//               </div>
//             </div>
//           </div>
//         </div>
//         <TextArea
//           defaultValue={jobDoc?.description || ''}
//           placeholder="Job description"
//           resize="vertical"
//           name="description" />
//         <div className="flex justify-center">
//           <Button size="3">
//             <span className="px-8">Save</span>
//           </Button>
//         </div>
//       </form>
//     </Theme>
//   );
// }