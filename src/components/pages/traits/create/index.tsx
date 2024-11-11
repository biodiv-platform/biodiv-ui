import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Textarea
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { axCreateTrait } from "@services/traits.service";
import React, { useState } from "react";

interface TraitValue {
  description: string;
  value: string;
}

interface Trait {
  name: string;
  description: string;
  category: string;
  isObservation: boolean;
  Paritcipatory: boolean;
  type: string;
  dataType: string;
  values: TraitValue[]; // Define values as an array of strings
}

export default function TraitsCreateComponent() {
  const [trait, setTrait] = useState<Trait>({
    name: "",
    description: "",
    category: "",
    isObservation: false,
    Paritcipatory: false,
    type: "",
    dataType: "",
    values: [
      {
        description: "",
        value: ""
      }
    ]
  });

  function handleSubmit(event) {
    event.preventDefault();
    const traitValues = trait.values.map((item) => `${item.description}:${item.value}`).join("|");
    const params = {
      dataType: trait.dataType,
      description: trait.description,
      name: trait.name,
      traitTypes: trait.type,
      showInObservation: trait.isObservation,
      isParticipatory: trait.Paritcipatory,
      values: traitValues
    };
    axCreateTrait(params);
  }

  function handleAddValue() {
    setTrait((prevTrait) => ({
      ...prevTrait,
      values: prevTrait.values.concat({ description: "", value: "" }) // Append an empty string for a new input
    }));
  }

  const removeValue = (index: number) => {
    setTrait((prevTrait) => {
      const updatedValues = prevTrait.values.filter((_, i) => i !== index);
      return {
        ...prevTrait,
        values: updatedValues
      };
    });
  };

  const handleValueChange = (index: number, field: keyof TraitValue, newValue: string) => {
    setTrait((prevTrait) => {
      const updatedValues = prevTrait.values;
      updatedValues[index] = { ...updatedValues[index], [field]: newValue };
      return {
        ...prevTrait,
        values: updatedValues
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrait((prevTrait) => ({
      ...prevTrait,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="container mt">
      <PageHeading>Add Traits</PageHeading>
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 6 }} spacing={{ md: 4 }} mb={4}>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel htmlFor="name">Trait Name</FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                value={trait.name}
                onChange={handleChange}
                placeholder="Enter trait name"
                required
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel htmlFor="dataType">Data Type</FormLabel>
              <Select
                id="dataType"
                name="dataType"
                value={trait.dataType}
                onChange={handleChange}
                placeholder="Select type"
                required
              >
                <option value="STRING">String</option>
                <option value="NUMERIC">Numeric</option>
                <option value="DATE">Date</option>
                <option value="COLOR">Color</option>
              </Select>
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
                required
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
        <Divider mb={4} mt={4}/>
        <Heading mb={4} fontSize="xl">
          Define Trait Values
        </Heading>
        {trait.values.map((valueObj, index) => (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }} mb={4}>
            <GridItem>
              <Input
                placeholder="Name"
                value={valueObj.value}
                onChange={(e) => handleValueChange(index, "value", e.target.value)}
                required
              />
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                placeholder="Description"
                value={valueObj.description}
                onChange={(e) => handleValueChange(index, "description", e.target.value)}
              />
            </GridItem>
            <GridItem>
              <IconButton
                aria-label="Remove value"
                icon={<CloseIcon />}
                onClick={() => removeValue(index)}
                size="sm"
                colorScheme="red"
              />
            </GridItem>
          </SimpleGrid>
        ))}
        <Box mb={4}>
          <Button onClick={handleAddValue} colorScheme="green" mb={4}>
            Add Trait Value
          </Button>
          <Divider/>
        </Box>
        <Button type="submit" colorScheme="blue">Add Traits</Button>
      </form>
    </div>
  );
}
