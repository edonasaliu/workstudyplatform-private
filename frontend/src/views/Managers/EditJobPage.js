import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router';
import { FaSave, FaUndo, FaTimes } from 'react-icons/fa';
import JobDescriptionPage from './JobDescriptionPage';

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "2rem",
  },
  header: {
    backgroundColor: "#fff5f1",
    borderRadius: "10px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  formCard: {
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    padding: "2rem",
  },
  sectionTitle: {
    color: "#2c3e50",
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1.5rem",
    paddingBottom: "0.5rem",
    borderBottom: "2px solid #f45d26",
  },
};

/**
 * Edit Job Page Component
 * Allows users to modify existing job postings with pre-filled form data
 */
function EditJobPage() {
  const [jobData, setJobData] = useState({ hiring_semesters: [] });
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();

  useEffect(() => {
    const fetchJobById = async () => {
      try {
        const response = await fetch(`http://localhost:8080/jobs/${jobId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        const hiringSemesters = data.hiring_semesters.split(',');
        setJobData({ ...data, hiring_semesters: hiringSemesters });
      } catch (error) {
        console.error('Error fetching job:', error);
        alert('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobById();
  }, [jobId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const data = {};

    formData.forEach((value, key) => {
      if (key === 'hiringSemester') {
        data[key] = (data[key] || []).concat([value]);
      } else {
        data[key] = value;
      }
    });

    try {
      const response = await fetch(`http://localhost:8080/jobs/${jobId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      const hiringSemesters = responseData.hiring_semesters.split(',');
      setJobData({ ...responseData, hiring_semesters: hiringSemesters });
      setShowJobDescription(true);
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setJobData(prev => ({
        ...prev,
        hiring_semesters: [...prev.hiring_semesters, e.target.value]
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        hiring_semesters: prev.hiring_semesters.filter(semester => semester !== e.target.value)
      }));
    }
  };

  if (showJobDescription) {
    return <JobDescriptionPage jobData={jobData} />;
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <Card style={styles.header}>
          <Card.Body>
            <h1>Loading job details...</h1>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Edit Work-Study Position
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>
            Update the details for this position
          </p>
        </Card.Body>
      </Card>

      <Card style={styles.formCard}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <h2 style={styles.sectionTitle}>Basic Information</h2>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position Title<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="positionTitle"
                    defaultValue={jobData.title}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Department<span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="department" 
                    defaultValue={jobData.department}
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Admission">Admission</option>
                    <option value="Academics">Academics</option>
                    <option value="Student Services">Student Services</option>
                    <option value="Psych Lab">Psych Lab</option>
                    <option value="AI Lab">AI Lab</option>
                    <option value="Finance">Finance</option>
                    <option value="Ops">Ops</option>
                    <option value="Student Life">Student Life</option>
                    <option value="Admin">Admin</option>
                    <option value="CTD">CTD</option>
                    <option value="Advancement">Advancement</option>
                    <option value="Enrollment">Enrollment</option>
                    <option value="External relations">External Relations</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Manager Name<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="managerName"
                    defaultValue={jobData.manager_name}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Manager Email<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="managerEmail"
                    defaultValue={jobData.manager_email}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Position Details */}
            <h2 style={styles.sectionTitle}>Position Details</h2>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role Location<span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="roleLocation"
                    defaultValue={jobData.role_location}
                    required
                  >
                    <option value="Virtual">Virtual</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Seoul">Seoul</option>
                    <option value="Taipei">Taipei</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="London">London</option>
                    <option value="Berlin">Berlin</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type of Work<span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="typeOfWork"
                    defaultValue={jobData.type_of_work}
                    required
                  >
                    <option value="Researching">Researching</option>
                    <option value="Crafting communications">Crafting communications</option>
                    <option value="Planning">Planning</option>
                    <option value="Analysing">Analysing</option>
                    <option value="Critiquing">Critiquing</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Min Students<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="minStudents"
                        defaultValue={jobData.min_students}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Students<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="maxStudents"
                        defaultValue={jobData.max_students}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Hiring Semesters<span className="text-danger">*</span></Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="checkbox"
                      label="Fall"
                      name="hiringSemester"
                      value="Fall Semester"
                      checked={jobData.hiring_semesters.includes("Fall Semester")}
                      onChange={handleCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Spring"
                      name="hiringSemester"
                      value="Spring Semester"
                      checked={jobData.hiring_semesters.includes("Spring Semester")}
                      onChange={handleCheckboxChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Summer"
                      name="hiringSemester"
                      value="Summer Semester"
                      checked={jobData.hiring_semesters.includes("Summer Semester")}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* Job Description */}
            <h2 style={styles.sectionTitle}>Job Description</h2>
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Brief Description<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="briefDescription"
                    defaultValue={jobData.brief_description}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Prerequisites</Form.Label>
                  <Form.Control
                    type="text"
                    name="prerequisites"
                    defaultValue={jobData.prerequisites}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Detailed Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="moreDetails"
                    defaultValue={jobData.more_details}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Application Details */}
            <h2 style={styles.sectionTitle}>Application Details</h2>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Deadline<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="applicationDeadline"
                    defaultValue={jobData.application_deadline}
                    placeholder="Format: 06 September 2024"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="light"
                type="reset"
                className="d-flex align-items-center gap-2"
              >
                <FaUndo /> Reset
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#f45d26',
                  borderColor: '#f45d26',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default EditJobPage;