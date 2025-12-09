import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ReactMarkdown from 'react-markdown'; 

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    margin: theme.spacing(3),
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UploadPage() {
    const [documentation, setDocumentation] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFile = async () => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://127.0.0.1:8000/api/upload/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || response.statusText);
            }

            const data = await response.json();
            setDocumentation(data.documentation);
            setSnackbarMessage("File uploaded and documentation generated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

        } catch (error) {
            console.error("Error uploading file:", error);
            setDocumentation('Error: ${error.message}');
            setSnackbarMessage('File upload failed: ${error.message}');
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setUploading(false);
        }
    };

    const generatePDF = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/generate-pdf/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ documentation }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || response.statusText);
            }

            const blob = await response.blob();
            setPdfBlob(blob);
            setSnackbarMessage("PDF generated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

        } catch (error) {
            console.error("Error generating PDF:", error);
            setSnackbarMessage('PDF generation failed: ${error.message}');
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const downloadPDF = () => {
        if (pdfBlob) {
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Generated_Documentation.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <StyledPaper elevation={3}>
            <Typography variant="h4" gutterBottom>Automated Code Documentation Generator</Typography>

            <Typography variant="h6" gutterBottom>Upload a File</Typography>
            <input type="file" onChange={handleFileChange} id="file-upload" style={{ display: 'none' }} />
            <Button variant="contained" component="label" htmlFor="file-upload">
                Choose File
            </Button>
            <Button variant="contained" onClick={uploadFile} disabled={!file || uploading} style={{ marginLeft: '10px' }}>
                {uploading ? <CircularProgress size={20} color="inherit" /> : "Upload and Generate Docs"}
            </Button>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Documentation</Typography>
            <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "200px", backgroundColor: "#f9f9f9" }}>
                <ReactMarkdown>{documentation}</ReactMarkdown>
            </div>

            <Button variant="contained" onClick={generatePDF} disabled={!documentation} style={{ marginTop: '20px' }}>Generate PDF</Button>
            {pdfBlob && (
                <Button variant="contained" onClick={downloadPDF} style={{ marginLeft: '10px' }}>
                    Download PDF
                </Button>
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </StyledPaper>
    );
}

export default UploadPage;