import {
  Checkbox,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Textarea
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { TextBoxField } from "@components/form/text";
import React, { useState } from "react";

export default function TraitsCreateComponent() {
  const [trait, setTrait] = useState({
    name: "",
    description: "",
    category: "",
    isObservation: false,
    Paritcipatory: false,
    type: ""
  });

  function handleSubmit() {
    console.log(trait);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrait((prevTrait) => ({
      ...prevTrait,
      [name]: value
    }));
  };

  return (
    <div className="container mt">
      <PageHeading>Add Traits</PageHeading>
      <Heading mb={4} fontSize="2xl">
        Add new trait
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 6 }} spacing={{ md: 4 }} mb={2}>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel htmlFor="name">Trait Name</FormLabel>
            <Input
              type="text"
              id="name"
              name="Trait name"
              value={trait.name}
              onChange={handleChange}
              placeholder="Enter trait name"
              required
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel htmlFor="category">Category</FormLabel>
            <Input
              type="text"
              id="category"
              name="category"
              value={trait.category}
              onChange={handleChange}
              placeholder="Enter trait category"
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel htmlFor="type">Type</FormLabel>
            <Select
              id="type"
              name="type"
              value={trait.type}
              onChange={handleChange}
              placeholder="Select type"
            >
              <option value="MULTIPLE_CATEGORICAL">Multiple Categorical</option>
              <option value="SINGLE_CATEGORICAL">Single Categorical</option>
              <option value="RANGE">Range</option>
            </Select>
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <FormControl>
            <Checkbox
              id="isObservation"
              name="isObservation"
              isChecked={trait.isObservation}
              onChange={handleChange}
            >
              Observation Trait
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem colSpan={5}>
          <FormControl>
            <Checkbox
              id="Paritcipatory"
              name="Paritcipatory"
              isChecked={trait.Paritcipatory}
              onChange={handleChange}
            >
              Paritcipatory
            </Checkbox>
          </FormControl>
        </GridItem>
        <GridItem colSpan={6}>
        <FormControl>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          id="description"
          name="description"
          value={trait.description}
          onChange={handleChange}
          placeholder="Enter trait description"
          rows={4}
        />
      </FormControl>
        </GridItem>
      </SimpleGrid>
    </div>
  );
}
